import * as cdk from "aws-cdk-lib";
import { Construct } from "constructs";

import * as origins from "aws-cdk-lib/aws-cloudfront-origins";
import * as cloudfront from "aws-cdk-lib/aws-cloudfront";
import * as apigateway from "aws-cdk-lib/aws-apigateway";
import * as dynamodb from "aws-cdk-lib/aws-dynamodb";
import * as lambda from "aws-cdk-lib/aws-lambda";
import * as iam from "aws-cdk-lib/aws-iam";

import * as s3_deployment from "aws-cdk-lib/aws-s3-deployment";
import * as s3 from "aws-cdk-lib/aws-s3";

import * as path from "path";
import * as fs from "fs";

export class CdkStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props: cdk.StackProps) {
    super(scope, id, props);

    // Code from Task 2

    // Hint: S3 Bucket Setup
    // Create an S3 bucket for hosting website content.

    // Hint: S3 Bucket Deployment
    // Deploy website content to the S3 bucket.

    // Hint: CloudFront Distribution Setup
    // Create a CloudFront Origin Access Identity.
    // Set up a CloudFront distribution with the S3 bucket as the origin.

    // Reminder:
    // Build the website using the following command:
    // npm run build
    //
    // provide the API GW url to the vehicle_app
    // here /app/vehicle_app/src/components/make-vehicle.jsx#L73
    // and here /app/vehicle_app/src/components/find-all-vehicles.jsx#L22
  }
}
