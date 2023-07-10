import { NestFactory } from '@nestjs/core';
import helmet from 'helmet';

import { AppModule } from './app.module';

async function bootstrap(): Promise<any> {
  const app = await NestFactory.create(AppModule);

  app.enableCors({
    origin: (req, callback) => callback(null, true),
  });
  app.use(helmet());

  return app.init();
}

export const handler = async (
  event: any,
  context: any
): Promise<any> => {
  const app = await bootstrap();
  
  const result = await app.handle(event, context);

  return {
    statusCode: result.status,
    body: JSON.stringify(result.body),
    headers: result.headers,
  };
};