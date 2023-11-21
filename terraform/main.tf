### Dynamo ###

resource "aws_dynamodb_table" "dynamodb_table" {
  hash_key     = "id"
  billing_mode = "PAY_PER_REQUEST"
  name         = "Vehicle"
  attribute {
    name = "id"
    type = "S"
  }
  # tags = {}
}

### λ-Func ####

resource "aws_iam_role" "iam_role" {
  name = "api-role"
  path = "/service-role/"
  assume_role_policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Principal = {Service = "lambda.amazonaws.com"}
        Action    = "sts:AssumeRole"
        Effect    = "Allow"
      }
    ]
  })
  inline_policy {
    name   = "api-policy"
    policy = jsonencode({
      Version = "2012-10-17"
      Statement = [
        {
          Resource = aws_dynamodb_table.dynamodb_table.arn
          Action   = ["dynamodb:DeleteItem", "dynamodb:GetItem", "dynamodb:PutItem", "dynamodb:Scan"]
          Effect   = "Allow"
        }
      ]
    })
  }
}

resource "aws_iam_role_policy_attachment" "cwl_attachment" {
  role       = aws_iam_role.iam_role.name
  policy_arn = "arn:aws:iam::aws:policy/service-role/AWSLambdaBasicExecutionRole"
}

data "archive_file" "archive" {
  type        = "zip"
  output_path = "vehicle-api.zip"
  source_dir  = "${path.module}/../api/vehicle_api"
}

data "aws_region" "current" {}

resource "aws_lambda_function" "api_resolver" {
  function_name = "api-resolver"

  handler = "api_resolver.lambda_handler"
  runtime = "python3.11"
  timeout = 10

  filename         = data.archive_file.archive.output_path
  source_code_hash = data.archive_file.archive.output_base64sha256

  layers = [
    "arn:aws:lambda:${data.aws_region.current.name}:017000801446:layer:AWSLambdaPowertoolsPythonV2-Arm64:22"
  ]

  environment {
    variables = {
      TABLE = aws_dynamodb_table.dynamodb_table.id
    }
  }

  role          = aws_iam_role.iam_role.arn
  architectures = ["arm64"] # Use Graviton2

  # tags = {}
}

resource "aws_lambda_function_url" "api_resolver_url" {
  function_name      = aws_lambda_function.api_resolver.function_name
  authorization_type = "NONE"

  cors {
    allow_origins = ["*"]
    allow_methods = ["*"]
    max_age       = 86400
  }
}

### API-Gateway ###

resource "aws_lambda_permission" "lambda_permission" {
  source_arn    = "${aws_api_gateway_rest_api.rest_api.execution_arn}/*/*/*" # STAGE/METHOD/PATH
  function_name = aws_lambda_function.api_resolver.function_name
  principal     = "apigateway.amazonaws.com"
  action        = "lambda:InvokeFunction"
}

resource "aws_api_gateway_rest_api" "rest_api" {
  name = "vehicle-api"
  body = templatefile("${path.module}/../api/openapi.yml", { uri = aws_lambda_function.api_resolver.invoke_arn })
  endpoint_configuration { types = ["REGIONAL"] }
}

resource "aws_api_gateway_deployment" "deployment" {
  triggers    = { redeployment = sha1(jsonencode(aws_api_gateway_rest_api.rest_api.body)) }
  rest_api_id = aws_api_gateway_rest_api.rest_api.id
  lifecycle { create_before_destroy = true }
}

resource "aws_api_gateway_stage" "default" {
  deployment_id = aws_api_gateway_deployment.deployment.id
  rest_api_id   = aws_api_gateway_rest_api.rest_api.id
  stage_name    = "default"
}

### WAF ###

locals {
  rules = ["AWSManagedRulesCommonRuleSet"]
}

resource "aws_wafv2_web_acl_association" "web_acl_association" {
  resource_arn = aws_api_gateway_stage.default.arn
  web_acl_arn  = aws_wafv2_web_acl.web_acl.arn
}

resource "aws_wafv2_web_acl" "web_acl" {
  scope = "REGIONAL"
  name  = "vehicle-api-web-acl"

  visibility_config {
    cloudwatch_metrics_enabled = true
    metric_name                = "vehicle-api-web-acl"
    sampled_requests_enabled   = true
  }

  default_action {
    allow {}
  }

  rule {
    name     = "GeoMatchRule"
    priority = length(local.rules) + 2
    visibility_config {
      cloudwatch_metrics_enabled = true
      metric_name                = "vehicle-api-geo-match-rule"
      sampled_requests_enabled   = true
    }
    statement {
      geo_match_statement {
        country_codes = ["US"] # TODO => "DE"
      }
    }
    action {
      block {}
    }
  }

  rule {
    name     = "RateBasedRule"
    priority = length(local.rules) + 1
    visibility_config {
      cloudwatch_metrics_enabled = true
      metric_name                = "vehicle-api-rate-based-rule"
      sampled_requests_enabled   = true
    }
    statement {
      rate_based_statement {
        limit              = 100
        aggregate_key_type = "IP"
      }
    }
    action {
      block {}
    }
  }

  dynamic "rule" {
    for_each = toset(local.rules)
    content {
      name     = rule.value
      priority = index(local.rules, rule.value) + 1

      visibility_config {
        cloudwatch_metrics_enabled = true
        metric_name                = "vehicle-api-${rule.value}"
        sampled_requests_enabled   = true
      }
      statement {
        managed_rule_group_statement {
          name        = rule.value
          vendor_name = "AWS"
        }
      }
      override_action {
        none {}
      }
    }
  }
}

### CDN + S3 ###

resource "aws_s3_bucket" "website" {
  bucket = "vehicle-app-36fd602d-8dd4-481f-9766-2bb6caa86526"
}

resource "aws_s3_bucket_website_configuration" "website_configuration" {
  bucket = aws_s3_bucket.website.id
  index_document { suffix = "index.html" }
}

data "aws_iam_policy_document" "oac_policy" {
  statement {
    principals {
      type        = "Service"
      identifiers = ["cloudfront.amazonaws.com"]
    }
    actions   = ["s3:GetObject"]
    resources = ["${aws_s3_bucket.website.arn}/*"]
    condition {
      values = [
        "${aws_cloudfront_distribution.cdn.arn}"
      ]
      variable = "AWS:SourceArn"
      test     = "StringEquals"#
    }
  }
}

resource "aws_s3_bucket_policy" "website_policy" {
  policy = data.aws_iam_policy_document.oac_policy.json
  bucket = aws_s3_bucket.website.id
}

resource "aws_cloudfront_origin_access_control" "oac" {
  name                              = "example"
  description                       = "example"
  origin_access_control_origin_type = "s3"
  signing_behavior                  = "always"
  signing_protocol                  = "sigv4"#
}

resource "aws_cloudfront_response_headers_policy" "security_headers_policy" {
  name = "security-headers-policy"
  security_headers_config {
    content_security_policy {
      content_security_policy = "default-src 'none'; img-src images.unsplash.com; font-src fonts.gstatic.com; style-src 'unsafe-inline' fonts.googleapis.com; script-src 'self'; connect-src 5j9wr32l57.execute-api.eu-west-1.amazonaws.com"
      override = true
    }
  }
}

resource "aws_cloudfront_distribution" "cdn" {
  origin {
    domain_name              = aws_s3_bucket.website.bucket_regional_domain_name
    origin_access_control_id = aws_cloudfront_origin_access_control.oac.id
    origin_id                = "_s3_origin"
  }

  default_cache_behavior {
    response_headers_policy_id = aws_cloudfront_response_headers_policy.security_headers_policy.id
    viewer_protocol_policy     = "https-only"
    target_origin_id           = "_s3_origin"
    cache_policy_id            = "658327ea-f89d-4fab-a63d-7e88639e58f6"
    allowed_methods            = ["GET", "HEAD", "OPTIONS", "PATCH", "POST", "PUT", "DELETE"]
    cached_methods             = ["GET", "HEAD", "OPTIONS"]
  }

  restrictions {
    geo_restriction {
      restriction_type = "none"
      locations        = []
    }
  }

  viewer_certificate {
    cloudfront_default_certificate = true
  }

  default_root_object = "index.html"
  enabled             = true
}
