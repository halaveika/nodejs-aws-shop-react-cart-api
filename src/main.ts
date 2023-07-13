import { NestFactory } from '@nestjs/core';
import { Context, APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import { AppModule } from './app.module';

let cachedApp: any;

async function bootstrap(): Promise<any> {
  if (!cachedApp) {
    const app = await NestFactory.create(AppModule);
    await app.init();
    cachedApp = app;
  }
  return cachedApp;
}

export const handler = async (
  event: APIGatewayProxyEvent,
  context: Context
): Promise<APIGatewayProxyResult> => {
  const app = await bootstrap();
  const proxyEvent = {
    ...event,
    requestContext: {
      ...event.requestContext,
      requestId: context.awsRequestId,
    },
  };

  const expressApp = app.getHttpAdapter().getInstance();
  const response = await new Promise<any>((resolve, reject) => {
    expressApp(proxyEvent, {} as any, (err: any, result: any) => {
      if (err) {
        reject(err);
      } else {
        resolve(result);
      }
    });
  });

  return {
    statusCode: response.statusCode,
    body: response.body,
    headers: response.headers,
    isBase64Encoded: response.isBase64Encoded || false,
  };
};
