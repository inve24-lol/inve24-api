import { ITokenCacheRepository } from '@core/redis/abstracts/token-cache-repository.abstract';
import { REFRESH_TOKEN_REDIS_NAMESPACE } from '@core/redis/constants/redis.namespace';
import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { RedisService } from '@liaoliaots/nestjs-redis';
import Redis from 'ioredis';

@Injectable()
export class TokenCacheRepositoryImpl implements ITokenCacheRepository {
  private readonly redis: Redis;

  constructor(private readonly redisService: RedisService) {
    this.redis = this.redisService.getOrThrow(REFRESH_TOKEN_REDIS_NAMESPACE);
  }

  async setToken(uuid: string, token: string, ttl: number): Promise<string> {
    try {
      return await this.redis.set(uuid, token, 'EX', ttl);
    } catch (error) {
      throw new InternalServerErrorException('Set failed.');
    }
  }

  async getToken(uuid: string): Promise<string | null> {
    try {
      return await this.redis.get(uuid);
    } catch (error) {
      throw new InternalServerErrorException('Get failed.');
    }
  }

  async delToken(uuid: string): Promise<void> {
    try {
      await this.redis.del(uuid);
    } catch (error) {
      throw new InternalServerErrorException('Delete failed.');
    }
  }
}
