import { NestFactory } from '@nestjs/core';
import { GatewayModule } from './app.module';
import * as express from 'express';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
async function bootstrap() {
  const app = await NestFactory.create(GatewayModule);
  app.enableCors({})

  await app.listen(process.env.PORT ?? 8080);
}
bootstrap();
