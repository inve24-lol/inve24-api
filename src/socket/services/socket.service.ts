import redisConfig from '@config/settings/redis.config';
import { Inject, Injectable } from '@nestjs/common';
import { ConfigType } from '@nestjs/config';
import { ISocketClientCacheRepository } from '@redis/abstracts/socket-client-repository.abstract';

@Injectable()
export class SocketService {
  constructor(
    private readonly socketClientCacheRepository: ISocketClientCacheRepository,
    @Inject(redisConfig.KEY) private readonly config: ConfigType<typeof redisConfig>,
  ) {}

  async getSocketStatus(puuid: string): Promise<string | void> {
    const cachedPuuid = await this.socketClientCacheRepository.getSocketStatus(puuid);

    if (cachedPuuid) return cachedPuuid;
  }

  async setSocketStatus(puuid: string, socketStatus: string): Promise<void> {
    await this.socketClientCacheRepository.setSocketStatus(
      puuid,
      socketStatus,
      this.config.redis.socketClient.ttl,
    );
  }

  async delSocketStatus(puuid: string): Promise<void> {
    await this.socketClientCacheRepository.delSocketStatus(puuid);
  }
}
