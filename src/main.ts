import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { LoggerErrorInterceptor } from 'nestjs-pino';
import { Logger } from 'nestjs-pino/Logger';
import { AppModule } from './app.module';
import { TransformInterceptor } from './transform.interceptor';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { bufferLogs: true });

  // setup nestjs to use the logger from pino package
  // https://www.tomray.dev/nestjs-logging
  app.useLogger(app.get(Logger));
  
  // include stack trace in the error logs
  app.useGlobalInterceptors(new LoggerErrorInterceptor());

  // setup nestjs to use the validation pipes from class-validator package in all incoming requests
  app.useGlobalPipes(new ValidationPipe());

  // custom transform interceptor to transform the response data of all responses using @Exclude({ toPlainOnly: true }) decorator
  app.useGlobalInterceptors(new TransformInterceptor());

  await app.listen(3000);
}
bootstrap();
