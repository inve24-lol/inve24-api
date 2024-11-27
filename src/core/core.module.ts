import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RedisModule } from '@liaoliaots/nestjs-redis';
import { validationSchema } from '@core/config/validations/validation-schema';
import { TypeOrmModuleOptionsFactory } from '@core/type-orm/factories/type-orm-module-options.factory';
import { RedisModuleOptionsFactory } from '@core/redis/factories/redis-module-options.factory';
import serverConfig from '@core/config/server.config';
import databaseConfig from '@core/config/database.config';
import jwtConfig from '@core/config/jwt.config';
import bcryptConfig from '@core/config/bcrypt.config';
import mailConfig from '@core/config/mail.config';
import redisConfig from '@core/config/redis.config';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: [`.env.${process.env.NODE_ENV}`],
      load: [serverConfig, databaseConfig, jwtConfig, bcryptConfig, mailConfig, redisConfig],
      isGlobal: true,
      validationSchema: validationSchema,
    }),
    TypeOrmModule.forRootAsync({ useClass: TypeOrmModuleOptionsFactory }),
    RedisModule.forRootAsync({ useClass: RedisModuleOptionsFactory }),
  ],
})
export class CoreModule {}
