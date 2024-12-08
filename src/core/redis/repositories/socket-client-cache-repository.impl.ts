import { ISocketClientCacheRepository } from '@redis/abstracts/socket-client-repository.abstract';
import { SOCKET_CLIENT_REDIS_NAMESPACE } from '@redis/constants/redis.namespace';
import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { RedisService } from '@liaoliaots/nestjs-redis';
import Redis from 'ioredis';

@Injectable()
export class SocketClientCacheRepositoryImpl implements ISocketClientCacheRepository {
  private readonly redis: Redis;

  constructor(private readonly redisService: RedisService) {
    this.redis = this.redisService.getOrThrow(SOCKET_CLIENT_REDIS_NAMESPACE);
  }

  async setSocketStatus(puuid: string, status: string, ttl: number): Promise<string> {
    try {
      return await this.redis.set(puuid, status, 'EX', ttl);
    } catch (error) {
      throw new InternalServerErrorException('Set failed.');
    }
  }

  async getSocketStatus(puuid: string): Promise<string | null> {
    try {
      return await this.redis.get(puuid);
    } catch (error) {
      throw new InternalServerErrorException('Get failed.');
    }
  }

  async delSocketStatus(puuid: string): Promise<void> {
    try {
      await this.redis.del(puuid);
    } catch (error) {
      throw new InternalServerErrorException('Delete failed.');
    }
  }
}
