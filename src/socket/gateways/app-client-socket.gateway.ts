import { UnauthorizedException } from '@nestjs/common';
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
  namespace: '/ws/socket/app',
})
@WebSocketGateway()
export class AppClientSocketGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  constructor(
    private readonly socketService: SocketService,
    private readonly summonerService: SummonerService,
  ) {}

  @WebSocketServer() private server!: Server;

  afterInit(server: Server) {
    this.server = server;
  }

  async handleConnection(@ConnectedSocket() appClient: Socket): Promise<void> {
    try {
      const { socketEntryCode } = appClient.handshake.auth;

      if (!socketEntryCode) throw new UnauthorizedException('Auth 형식이 잘못되었습니다.');

      const summoner = await this.summonerService.findSummonerProfileByPuuid(socketEntryCode);

      // if (!summoner)
      //   throw new UnauthorizedException(
      //     '플레이 중이신 라이엇 계정이 서비스에 등록되어 있지 않습니다.',
      //   );

      await this.socketService.setSocketStatus(socketEntryCode, 'pending');

      console.log('기본 방', appClient.rooms);

      appClient.emit('invite-room', { message: '라이엇 계정 인증 성공', data: null });
    } catch (error) {
      console.error(`일렉트론 소켓 연결 실패 (id: ${appClient.id})`);
      appClient.emit('handle-connection-error', error);
      appClient.disconnect(true);
    }
  }

  handleDisconnect(@ConnectedSocket() appClient: Socket): void {
    console.log(`종료된 일렉트론 소켓 (id: ${appClient.id})`);
  }

  @SubscribeMessage('join-room')
  handleJoinRoom(
    @ConnectedSocket() appClient: Socket,
    @MessageBody() body: { roomId: string },
  ): void {
    const { roomId } = body;

    appClient.join(roomId);

    console.log('puuid 방 추가', appClient.rooms);

    // this.server
    //   .to(roomId)
    //   .emit('join-room-reply-app', { message: '화면에 발급된 QR코드를 찍어주세요.', data: null });

    appClient.emit('join-room-reply-app', {
      message: '서버 방 참여 성공',
      data: null,
    });
  }

  @SubscribeMessage('disconnect-request')
  async handleDisconnectRequest(@MessageBody() body: { socketEntryCode: string }): Promise<void> {
    const { socketEntryCode } = body;

    await this.socketService.delSocketStatus(socketEntryCode);
  }
}
