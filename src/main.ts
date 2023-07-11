import { NestFactory } from '@nestjs/core';
import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import { ExpressAdapter } from '@nestjs/platform-express';
import helmet from 'helmet';
import * as express from 'express';
import { AppModule } from './app.module';

async function bootstrap(): Promise<any> {
  const expressApp = express();
  const app = await NestFactory.create(
    AppModule,
    new ExpressAdapter(expressApp),
  );

  app.enableCors({
    origin: (req, callback) => callback(null, true),
  });
  app.use(helmet());

  await app.init();

  return expressApp;
}

export const handler = async (
  event: APIGatewayProxyEvent,
  context: any
): Promise<APIGatewayProxyResult> => {
  const app = await bootstrap();

  const result = await new Promise<APIGatewayProxyResult>((resolve, reject) => {
    const proxyEvent = {
      ...event,
      requestContext: {
        ...event.requestContext,
        requestId: context.awsRequestId,
      },
    };

    app.handle(proxyEvent, null, (err: any, response: any) => {
      if (err) {
        reject(err);
      } else {
        const statusCode = response?.statusCode ?? 500;
        const body = response?.body ?? '';
        const headers = response?.headers ?? {};

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