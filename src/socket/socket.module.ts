import { forwardRef, Module } from '@nestjs/common';
import { SocketService } from '@socket/services/socket.service';
import { AppClientSocketGateway } from '@socket/gateways/app-client-socket.gateway';
import { WebClientSocketGateway } from '@socket/gateways/web-client-socket.gateway';
import { SummonerModule } from '@summoner/summoner.module';
import { AuthModule } from '@auth/auth.module';

@Module({
  imports: [forwardRef(() => SummonerModule), AuthModule],
  providers: [SocketService, AppClientSocketGateway, WebClientSocketGateway],
  exports: [SocketService],
})
export class SocketModule {}
