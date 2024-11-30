import redisConfig from '@config/settings/redis.config';
import {
  EMAIL_CERT_CODE_REDIS_NAMESPACE,
  REFRESH_TOKEN_REDIS_NAMESPACE,
  SUMMONER_REDIS_NAMESPACE,
} from '@core/redis/constants/redis.namespace';
import {
  RedisModuleOptions,
  RedisOptionsFactory,
} from '@liaoliaots/nestjs-redis/dist/redis/interfaces';
import { Inject, Injectable } from '@nestjs/common';
import { ConfigType } from '@nestjs/config';

@Injectable()
export class RedisModuleOptionsFactory implements RedisOptionsFactory {
  constructor(@Inject(redisConfig.KEY) private readonly config: ConfigType<typeof redisConfig>) {}

  createRedisOptions(): RedisModuleOptions {
    return {
      config: [
        {
          namespace: EMAIL_CERT_CODE_REDIS_NAMESPACE,
          host: this.config.redis.host,
          port: this.config.redis.port,
          password: this.config.redis.password,
          db: this.config.redis.emailCertCode.db,
        },
        {
          namespace: REFRESH_TOKEN_REDIS_NAMESPACE,
          host: this.config.redis.host,
          port: this.config.redis.port,
          password: this.config.redis.password,
          db: this.config.redis.refreshToken.db,
        },
        {
          namespace: SUMMONER_REDIS_NAMESPACE,
          host: this.config.redis.host,
          port: this.config.redis.port,
          password: this.config.redis.password,
          db: this.config.redis.summoner.db,
        },
      ],
    };
  }
}
