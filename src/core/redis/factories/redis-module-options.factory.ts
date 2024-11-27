import redisConfig from '@core/config/redis.config';
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
      config: {
        host: this.config.redis.host,
        port: this.config.redis.port,
        password: this.config.redis.password,
      },
    };
  }
}
