import * as cdk from "aws-cdk-lib";
import { Bucket, CfnBucket } from "aws-cdk-lib/aws-s3";
import { Construct } from "constructs";

// Defining a L3 construct which extends the base CDK Stack class.
// These are even higher-level abstractions that are designed to help you complete common tasks in AWS with less code. They often combine multiple L1 and L2 constructs.
export class L3Bucket extends Construct {
  constructor(scope: Construct, id: string, experation: number) {
    super(scope, id);

    // Using L2 construct (Bucket) inside the L3 construct to define an S3 bucket.
    new Bucket(this, "myBucket", {
      lifecycleRules: [
        {
          expiration: cdk.Duration.days(experation),
        },
      ],
    });
  }
}

// Defining another CDK stack class to demonstrate the use of different construct levels.
export class CdkConstructStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id);

    // L1 construct example - directly maps to a CloudFormation resource for an S3 bucket.
    // These are direct mappings to AWS CloudFormation resources. They offer the most control but require detailed knowledge of the properties and behavior of AWS resources.
    new CfnBucket(this, "myL1Bucket", {
      lifecycleConfiguration: {
        rules: [
          {
            expirationInDays: 2,
            status: "Enabled",
          },
        ],
      },
    });

    // L2 construct example - a high-level abstraction for an S3 bucket with sensible defaults.
    // These constructs are abstractions that provide sensible defaults and reduce boilerplate code. They encapsulate a lot of the CloudFormation details.
    new Bucket(this, "myL2Bucket", {
      lifecycleRules: [
        {
          expiration: cdk.Duration.days(2),
        },
      ],
    });

    // L3 construct example - a custom construct built using L2 constructs for common tasks.
    new L3Bucket(this, "myL3Bucket", 2);
  }
}
