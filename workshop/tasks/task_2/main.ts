import * as apigateway from "aws-cdk-lib/aws-apigateway";
import * as dynamodb from "aws-cdk-lib/aws-dynamodb";
import * as lambda from "aws-cdk-lib/aws-lambda";
import * as iam from "aws-cdk-lib/aws-iam";

import * as path from "path";
import * as fs from "fs";

export class CdkStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props: cdk.StackProps) {
    super(scope, id, props);

    // Code from Task 1

    // Hint: API Gateway Setup
    // Use the API Gateway to create an HTTP API endpoint.
    // Read and modify the OpenAPI specification as necessary.
    // Link your Lambda function to the API Gateway.
    // Ensure the Lambda function has the necessary permissions to be invoked by the API Gateway.

    // Hint: WAF Deployment
    // Initialize and configure AWS WAF to secure your API.
    // - Create a WebACL with default action to allow all requests.
    // - Specify the WebACL to be regional and enable CloudWatch metrics for monitoring.
    // - Add rules for specific security measures, like rate limiting based on IP and geographic blocking.
    // - Ensure that CloudWatch metrics are enabled for each rule for detailed monitoring.
    // - Determine and set the resource ARN for the API Gateway to be associated with the WebACL.
    // - Associate the WebACL with the API Gateway’s resource ARN to enforce security measures on the API.
  }
}
