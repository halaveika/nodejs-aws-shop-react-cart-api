import { APIGatewayProxyEvent, APIGatewayProxyResult, Context, Callback } from 'aws-lambda';
import { configure as serverlessExpress } from '@vendia/serverless-express';
import { NestFactory } from '@nestjs/core';
import helmet from 'helmet';
import { Logger } from '@nestjs/common';
import { AppModule } from './app.module';

let server: any;

async function bootstrap(): Promise<any> {
  const app = await NestFactory.create(AppModule);
  app.enableCors({
    origin: (req, callback) => callback(null, true),
  });
  app.use(helmet());

  const logger = new Logger('Bootstrap');
  logger.log('Server starting...');

  await app.init();
  return app.getHttpAdapter().getInstance();
}

export const handler = async (
  event: APIGatewayProxyEvent,
  context: Context,
  callback: Callback,
): Promise<APIGatewayProxyResult> => {
  if (!server) {
    const app = await bootstrap();
    server = serverlessExpress({ app });
  }
  return server(event, context, callback);
};
