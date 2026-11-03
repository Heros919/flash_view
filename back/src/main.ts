import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Em desenvolvimento aceita qualquer origem (Live Server em :5500).
  // Em produção, defina FRONT_URL no .env com o endereço do front.
  app.enableCors({
    origin: process.env.FRONT_URL ?? true,
    credentials: true,
  });

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
      transformOptions: {
        enableImplicitConversion: true,
      },
    }),
  );

  const port = process.env.PORT ?? 3000;
  await app.listen(port);

  console.log(`Backend rodando em http://localhost:${port}`);
}

void bootstrap();