import * as cdk from 'aws-cdk-lib';
import * as lambda from 'aws-cdk-lib/aws-lambda';
import * as apigateway from 'aws-cdk-lib/aws-apigateway';
import * as path from 'path';

export class CartStack extends cdk.Stack {
  constructor(scope: any, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const lambdaFunction = new lambda.Function(this, 'CartLambda', {
      runtime: lambda.Runtime.NODEJS_14_X,
      handler: 'index.handler',
      code: lambda.Code.fromAsset(path.resolve(__dirname, '../../dist/src/')),
      memorySize: 1024,
    });

    const api = new apigateway.LambdaRestApi(this, 'CartApi', {
      handler: lambdaFunction,
    });

    new cdk.CfnOutput(this, 'CartApiEndpoint', {
      value: api.url ?? '',
    });
  }
}