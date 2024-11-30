import { SwaggerSetup } from '@common/utils/swagger/swagger-setup';
import { SERVER_CONFIG_TOKEN } from '@core/config/constants/config.token';
import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { AppModule } from '@src/app.module';
import cookieParser from 'cookie-parser';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const configService = app.get(ConfigService);

  const PORT = configService.get(SERVER_CONFIG_TOKEN).server.port;

  app.setGlobalPrefix('api', {
    exclude: ['/summoners'],
  });

  app.use(cookieParser());

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  new SwaggerSetup().init(app);

  await app.listen(PORT);
}
bootstrap();
