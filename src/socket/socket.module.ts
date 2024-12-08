import { Module } from '@nestjs/common';
import { SocketService } from '@socket/services/socket.service';
import { AppClientSocketGateway } from '@socket/gateways/app-client-socket.gateway';
import { WebClientSocketGateway } from '@socket/gateways/web-client-socket.gateway';
import { SummonerModule } from '@summoner/summoner.module';
import { ISocketClientCacheRepository } from '@redis/abstracts/socket-client-repository.abstract';
import { SocketClientCacheRepositoryImpl } from '@redis/repositories/socket-client-cache-repository.impl';

@Module({
  imports: [SummonerModule],
  providers: [
    SocketService,
    AppClientSocketGateway,
    WebClientSocketGateway,
    {
      provide: ISocketClientCacheRepository,
      useClass: SocketClientCacheRepositoryImpl,
    },
  ],
  exports: [SocketService],
})
export class SocketModule {}
