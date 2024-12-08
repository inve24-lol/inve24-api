import { AuthService } from '@auth/services/auth.service';
import { Role } from '@common/constants/roles.enum';
import { ForbiddenException, UnauthorizedException } from '@nestjs/common';
import {
  ConnectedSocket,
  MessageBody,
  OnGatewayConnection,
  OnGatewayDisconnect,
  OnGatewayInit,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { SocketService } from '@socket/services/socket.service';
import { SummonerService } from '@summoner/services/summoner.service';
import { Server, Socket } from 'socket.io';

@WebSocketGateway({
  cors: { origin: '*' },
  namespace: '/ws/socket/web',
})
@WebSocketGateway()
export class WebClientSocketGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  constructor(
    private readonly authService: AuthService,
    private readonly socketService: SocketService,
    private readonly summonerService: SummonerService,
  ) {}

  @WebSocketServer() private server!: Server;

  afterInit(server: Server) {
    this.server = server;
  }

  async handleConnection(@ConnectedSocket() webClient: Socket) {
    try {
      const { authorization } = webClient.handshake.headers;

      if (!authorization) throw new UnauthorizedException('헤더가 존재하지 않습니다.');

      const accessToken = authorization.split(' ')[1];

      if (!accessToken) throw new UnauthorizedException('엑세스 토큰이 필요합니다.');

      const { role } = await this.authService.verifyWebClientSocket(accessToken);

      if (role !== Role.GUEST)
        throw new ForbiddenException('해당 리소스에 접근할 수 있는 권한이 없습니다.');

      const { socketEntryCode } = webClient.handshake.auth;

      if (!socketEntryCode) throw new UnauthorizedException('Auth 형식이 잘못되었습니다.');

      const summoner = await this.summonerService.findSummonerProfileByPuuid(socketEntryCode);

      // if (!summoner)
      //   throw new UnauthorizedException(
      //     '플레이 중이신 라이엇 계정이 서비스에 등록되어 있지 않습니다.',
      //   );

      const cachedSocketStatus = await this.socketService.getSocketStatus(socketEntryCode);

      if (!cachedSocketStatus)
        throw new UnauthorizedException('연결된 데스크탑 앱이 존재하지 않습니다.');

      await this.socketService.setSocketStatus(socketEntryCode, 'active');

      console.log('기본 방', webClient.rooms);
    } catch (error) {
      console.error(`클라이언트 소켓 연결 실패 (id: ${webClient.id})`);
      webClient.emit('handle-connection-error', error);
      webClient.disconnect(true);
    }
  }

  handleDisconnect(@ConnectedSocket() webClient: Socket) {
    console.log(`종료된 클라이언트 소켓 (id: ${webClient.id})`);
  }

  @SubscribeMessage('join-room')
  handleJoinRoom(
    @ConnectedSocket() webClient: Socket,
    @MessageBody() body: { socketEntryCode: string },
  ) {
    const { socketEntryCode } = body;

    webClient.join(socketEntryCode);

    console.log('puuid 방 추가', webClient.rooms);

    webClient.emit('join-room-reply-web', {
      message: '데스크탑 앱과 연결되었습니다.',
      data: null,
    });
  }

  @SubscribeMessage('disconnect-request')
  async handleDisconnectRequest(@MessageBody() body: { socketEntryCode: string }): Promise<void> {
    const { socketEntryCode } = body;

    await this.socketService.delSocketStatus(socketEntryCode);
  }
}
