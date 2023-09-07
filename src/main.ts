import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get<ConfigService>(ConfigService);
  const port: number = configService.get('PORT');
  if (port === undefined) {
    console.warn('No port defined! Running on default port 3000');
  }
  app.enableCors({
    origin: configService.get('CLIENT_URL'),
    credentials: true,
  });
  app.listen(port ?? 3000);
}
bootstrap();
