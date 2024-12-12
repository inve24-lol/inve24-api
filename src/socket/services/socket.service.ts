import redisConfig from '@config/settings/redis.config';
import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { ConfigType } from '@nestjs/config';
import { ISocketClientCacheRepository } from '@redis/abstracts/socket-client-repository.abstract';
import { AppClientSocketGateway } from '@socket/gateways/app-client-socket.gateway';
import { WebClientSocketGateway } from '@socket/gateways/web-client-socket.gateway';

@Injectable()
export class SocketService {
  constructor(
    @Inject(forwardRef(() => AppClientSocketGateway)) private app: AppClientSocketGateway,
    @Inject(forwardRef(() => WebClientSocketGateway)) private web: WebClientSocketGateway,
    private readonly socketClientCacheRepository: ISocketClientCacheRepository,
    @Inject(redisConfig.KEY) private readonly config: ConfigType<typeof redisConfig>,
  ) {}

  async emitToApp(socketEntryCode: string, message: string) {
    this.app.server.to(socketEntryCode).emit('hello', { message, data: null });
  }

  async emitToWeb(socketEntryCode: string, message: string) {
    this.web.server.to(socketEntryCode).emit('hello', { message, data: null });
  }

  async emitToAll(socketEntryCode: string, message: string) {
    await this.emitToApp(socketEntryCode, message);
    await this.emitToWeb(socketEntryCode, message);
  }

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
