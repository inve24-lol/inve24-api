import { SwaggerSetup } from '@common/utils/swagger/swagger-setup';
import { SERVER_CONFIG_TOKEN } from '@config/constants/config.token';
import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import { AppModule } from '@src/app.module';
import cookieParser from 'cookie-parser';
import hbs from 'hbs';
import { join } from 'path';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  app.useStaticAssets(join(__dirname, '..', 'public'));
  app.setBaseViewsDir(join(__dirname, '..', 'views'));
  app.setViewEngine('hbs');
  hbs.registerPartials(join(__dirname, '..', 'views', 'partials'));

  const configService = app.get(ConfigService);

  const PORT = configService.get(SERVER_CONFIG_TOKEN).server.port;

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
