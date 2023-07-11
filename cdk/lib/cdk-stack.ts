import * as cdk from 'aws-cdk-lib';
import * as lambda from 'aws-cdk-lib/aws-lambda';
import * as apigateway from 'aws-cdk-lib/aws-apigateway';
import * as path from 'path';

export class CartStack extends cdk.Stack {
  constructor(scope: any, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const layer = new lambda.LayerVersion(this, 'NestJSLayer', {
      code: lambda.Code.fromAsset(path.resolve(__dirname, '../../layer/layer.zip')),
      compatibleRuntimes: [lambda.Runtime.NODEJS_18_X],
    });

    const lambdaFunction = new lambda.Function(this, 'CartLambda', {
      runtime: lambda.Runtime.NODEJS_18_X,
      handler: 'main.handler',
      code: lambda.Code.fromAsset(path.resolve(__dirname, '../../dist/src')),
      memorySize: 1024,
      layers: [layer],
    });

    const api = new apigateway.LambdaRestApi(this, 'CartApi', {
      handler: lambdaFunction,
    });

    new cdk.CfnOutput(this, 'CartApiEndpoint', {
      value: api.url ?? '',
    });
  }
}