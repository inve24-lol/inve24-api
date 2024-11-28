import { DocumentBuilder, OpenAPIObject, SwaggerModule } from '@nestjs/swagger';

export class SwaggerSetup {
  init(app: any): void {
    SwaggerModule.setup('api', app, this.swaggerDocs(app), this.swaggerOptions());
  }

  swaggerDocs(app: any): OpenAPIObject {
    return SwaggerModule.createDocument(app, this.swaggerConfig());
  }

  swaggerConfig(): Omit<OpenAPIObject, 'paths'> {
    return new DocumentBuilder()
      .setTitle('INVE24')
      .setDescription('INVE24 API Docs')
      .setVersion('0.0.1')
      .addBearerAuth(
        {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
          in: 'header',
          description: '인증에 필요한 엑세스 토큰',
        },
        'access-token',
      )
      .addCookieAuth(
        'refreshToken',
        {
          type: 'apiKey',
          in: 'cookie',
          description: '엑세스 토큰 갱신을 위한 리프레시 토큰',
        },
        'refresh-token',
      )
      .build();
  }

  swaggerOptions(): any {
    return {
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
    };
  }
}
