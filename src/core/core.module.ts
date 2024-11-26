import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { validationSchema } from '@core/config/validations/validation-schema';
import serverConfig from '@core/config/server.config';
import databaseConfig from '@core/config/database.config';
import jwtConfig from '@core/config/jwt.config';
import bcryptConfig from '@core/config/bcrypt.config';
import mailConfig from '@core/config/mail.config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TypeOrmModuleOptionsFactory } from '@core/type-orm/factories/type-orm-module-options.factory';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: [`.env.${process.env.NODE_ENV}`],
      load: [serverConfig, databaseConfig, jwtConfig, bcryptConfig, mailConfig],
      isGlobal: true,
      validationSchema: validationSchema,
    }),
    TypeOrmModule.forRootAsync({ useClass: TypeOrmModuleOptionsFactory }),
  ],
})
export class CoreModule {}
