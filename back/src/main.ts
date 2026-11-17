import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';
import helmet from 'helmet';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.use(helmet());

  const frontUrl = process.env.FRONT_URL;
  const isProduction = process.env.NODE_ENV === 'production';

  if (isProduction && !frontUrl) {
    throw new Error('FRONT_URL é obrigatória em produção');
  }

  app.enableCors({
    origin: frontUrl ?? true,
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