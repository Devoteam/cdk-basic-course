import * as cdk from "aws-cdk-lib";
import { Construct } from "constructs";

import * as dynamodb from "aws-cdk-lib/aws-dynamodb";
import * as lambda from "aws-cdk-lib/aws-lambda";
import * as iam from "aws-cdk-lib/aws-iam";

import * as path from "path";

export class CdkStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props: cdk.StackProps) {
    super(scope, id, props);

    // DynamoDB Table Setup
    // Hint: Define and configure a new DynamoDB table here.
    // Consider setting a meaningful name, billing mode, and partition key.

    // Lambda Function IAM Role Setup
    // Hint: Create an IAM role for your Lambda function.
    // This role should allow the Lambda function to interact with other AWS services, like DynamoDB.

    // Lambda Function Setup
    // Hint: Initialize your Lambda function here.
    // Set important properties like function name, runtime, handler, and code location.
    // Remember to link the function to the IAM role and set any necessary environment variables.
    // Think about how this function can interact with the DynamoDB table.
    // Add a touch of humor to the Lambda function's behavior if possible.

    // Lambda Function URL Endpoint (optional for testing)
    // Hint: If needed, create a URL endpoint for your Lambda function.
    // Set the authentication type and any other relevant properties.
  }
}
