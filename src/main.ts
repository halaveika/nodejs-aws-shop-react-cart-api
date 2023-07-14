import { NestFactory } from '@nestjs/core';
import { Context, APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import { AppModule } from './app.module';

let cachedApp: any;

async function bootstrap(): Promise<any> {
  if (!cachedApp) {
    const app = await NestFactory.create(AppModule);
    await app.init();
    cachedApp = app.getHttpAdapter().getInstance();
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

  const result = await new Promise<APIGatewayProxyResult>((resolve, reject) => {
    app.handle(proxyEvent, null, (err: any, response: any) => {
      if (err) {
        reject(err);
      } else {
        const statusCode = response?.statusCode;
        const body = response?.body;
        const headers = response?.headers;

        resolve({
          statusCode,
          body,
          headers,
        });
      }
    });
  });

  return result;
};
