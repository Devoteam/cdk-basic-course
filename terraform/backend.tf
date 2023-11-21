terraform {
  backend "s3" {
    bucket  = "vehicle-api-1234567890"
    region  = "eu-west-1"
    key     = "api.tf"
  }
}
