import * as cdk from 'aws-cdk-lib';
import * as lambda from 'aws-cdk-lib/aws-lambda';
import * as apiGateway from '@aws-cdk/aws-apigatewayv2-alpha';
import { HttpLambdaIntegration } from '@aws-cdk/aws-apigatewayv2-integrations-alpha';
import * as path from 'path';
import * as dotenv from 'dotenv';
dotenv.config();


export class CartStack extends cdk.Stack {
  constructor(scope: any, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const layer = new lambda.LayerVersion(this, 'NestJSLayer', {
      code: lambda.Code.fromAsset(path.resolve(__dirname, '../../layer/layer.zip')),
      compatibleRuntimes: [lambda.Runtime.NODEJS_18_X],
    });

    const shared = {
      runtime: lambda.Runtime.NODEJS_18_X,
      environment: {
        PG_DB_USER: process.env.PG_DB_USER || '',
        PG_DB_HOST: process.env.PG_DB_HOST || '',
        PG_DB_DATABASE: process.env.PG_DB_DATABASE || '',
        PG_DB_PASSWORD: process.env.PG_DB_PASSWORD || '',
        PG_DB_PORT: process.env.PG_DB_PORT || '5432',
      },
    };

    const lambdaFunction = new lambda.Function(this, 'CartLambda', {
      ...shared,
      handler: 'main.handler',
      code: lambda.Code.fromAsset(path.resolve(__dirname, '../../dist/src')),
      memorySize: 1024,
      layers: [layer],
    });

    const api = new apiGateway.HttpApi(this, 'CartApi', {
      corsPreflight: {
        allowHeaders: ['*'],
        allowOrigins: ['*'],
        allowMethods: [apiGateway.CorsHttpMethod.ANY],
      },
    });

    api.addRoutes({
      integration: new HttpLambdaIntegration('CartApiIntegration', lambdaFunction),
      path: '/{proxy+}',
      methods: [apiGateway.HttpMethod.GET],
    });

    new cdk.CfnOutput(this, 'CartApiEndpoint', {
      value: api.url || '',
    });
  }
}
