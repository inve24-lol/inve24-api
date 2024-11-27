import { IMailCacheRepository } from '@core/redis/abstracts/mail-cache-repository.abstract';
import { EMAIL_CERT_CODE_REDIS_NAMESPACE } from '@core/redis/constants/redis.namespace';
import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { RedisService } from '@liaoliaots/nestjs-redis';
import Redis from 'ioredis';

@Injectable()
export class MailCacheRepositoryImpl implements IMailCacheRepository {
  private readonly redis: Redis;

  constructor(private readonly redisService: RedisService) {
    this.redis = this.redisService.getOrThrow(EMAIL_CERT_CODE_REDIS_NAMESPACE);
  }

  async setCertCode(email: string, certCode: number, ttl: number): Promise<string> {
    try {
      return await this.redis.set(email, certCode, 'EX', ttl);
    } catch (error) {
      throw new InternalServerErrorException('Set failed.');
    }
  }

  async getCertCode(email: string): Promise<string | null> {
    try {
      return await this.redis.get(email);
    } catch (error) {
      throw new InternalServerErrorException('Get failed.');
    }
  }

  async delCertCode(email: string): Promise<void> {
    try {
      await this.redis.del(email);
    } catch (error) {
      throw new InternalServerErrorException('Delete failed.');
    }
  }
}
