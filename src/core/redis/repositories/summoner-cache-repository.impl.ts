import { ISummonerCacheRepository } from '@core/redis/abstracts/summoner-cache-repository.abstract';
import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { SUMMONER_REDIS_NAMESPACE } from '../constants/redis.namespace';
import { RedisService } from '@liaoliaots/nestjs-redis';
import Redis from 'ioredis';

@Injectable()
export class SummonerCacheRepositoryImpl implements ISummonerCacheRepository {
  private readonly redis: Redis;

  constructor(private readonly redisService: RedisService) {
    this.redis = this.redisService.getOrThrow(SUMMONER_REDIS_NAMESPACE);
  }

  async setSummoner(uuid: string, summoners: string, ttl: number): Promise<string> {
    try {
      return await this.redis.set(uuid, summoners, 'EX', ttl);
    } catch (error) {
      throw new InternalServerErrorException('Set failed.');
    }
  }

  async getSummoner(uuid: string): Promise<string | null> {
    try {
      return await this.redis.get(uuid);
    } catch (error) {
      throw new InternalServerErrorException('Get failed.');
    }
  }

  async delSummoner(uuid: string): Promise<void> {
    try {
      await this.redis.del(uuid);
    } catch (error) {
      throw new InternalServerErrorException('Delete failed.');
    }
  }
}
