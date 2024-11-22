import { SERVER_CONFIG_TOKEN } from '@core/config/constants/config.token';
import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from '@src/app.module';
import cookieParser from 'cookie-parser';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const configService = app.get(ConfigService);

  const PORT = configService.get(SERVER_CONFIG_TOKEN).server.port;

  app.setGlobalPrefix('api');

  app.use(cookieParser());

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  const config = new DocumentBuilder()
    .setTitle('NestJS Template')
    .setDescription(
      'This template helps you quickly start your user management service in Docker environments.',
    )
    .setVersion('0.0.1')
    .addBearerAuth(
      {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        in: 'header',
        description: 'Access Token required for authentication',
      },
      'access-token',
    )
    .addCookieAuth(
      'refreshToken',
      {
        type: 'apiKey',
        in: 'cookie',
        description: 'Refresh Token for renewing access token',
      },
      'refresh-token',
    )
    .build();

  const document = SwaggerModule.createDocument(app, config);

  SwaggerModule.setup('api', app, document, {
    swaggerOptions: {
      persistAuthorization: true,
      tagsSorter: 'alpha',
      operationsSorter: (a: Map<any, any>, b: Map<any, any>) => {
        const order = {
          post: '0',
          get: '1',
          put: '2',
          patch: '3',
          delete: '4',
        } as const;

        return order[a.get('method') as keyof typeof order].localeCompare(
          order[b.get('method') as keyof typeof order],
        );
      },
    },
  });

  await app.listen(PORT);
}
bootstrap();
