import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { validationSchema } from '@config/validations/validation-schema';
import serverConfig from '@config/settings/server.config';
import databaseConfig from '@config/settings/database.config';
import jwtConfig from '@config/settings/jwt.config';
import bcryptConfig from '@config/settings/bcrypt.config';
import mailConfig from '@config/settings/mail.config';
import redisConfig from '@config/settings/redis.config';
import riotConfig from '@config/settings/riot.config';

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
