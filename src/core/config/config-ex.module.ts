import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { validationSchema } from '@core/config/validations/validation-schema';
import serverConfig from '@core/config/settings/server.config';
import databaseConfig from '@core/config/settings/database.config';
import jwtConfig from '@core/config/settings/jwt.config';
import bcryptConfig from '@core/config/settings/bcrypt.config';
import mailConfig from '@core/config/settings/mail.config';
import redisConfig from '@core/config/settings/redis.config';
import riotConfig from '@core/config/settings/riot.config';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: [`.env.${process.env.NODE_ENV}`],
      load: [
        serverConfig,
        databaseConfig,
        jwtConfig,
        bcryptConfig,
        mailConfig,
        redisConfig,
        riotConfig,
      ],
      isGlobal: true,
      validationSchema: validationSchema,
    }),
  ],
})
export class ConfigExModule {}
