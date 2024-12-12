import { forwardRef, Inject, UnauthorizedException } from '@nestjs/common';
import {
  ConnectedSocket,
  MessageBody,
  OnGatewayConnection,
  OnGatewayDisconnect,
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
export class AppClientSocketGateway implements OnGatewayConnection, OnGatewayDisconnect {
  constructor(
    @Inject(forwardRef(() => SocketService)) private socketService: SocketService,
    private readonly summonerService: SummonerService,
  ) {}

  @WebSocketServer() public server!: Server;

  private _socketEntryCode!: string;

  async handleConnection(@ConnectedSocket() appClient: Socket): Promise<void> {
    try {
      const { socketEntryCode } = appClient.handshake.auth;

      if (!socketEntryCode) throw new UnauthorizedException('Auth 형식이 잘못되었습니다.');

      const summoner = await this.summonerService.findSummonerProfileByPuuid(socketEntryCode);

      if (!summoner)
        throw new UnauthorizedException(
          '플레이 중이신 라이엇 계정이 서비스에 등록되어 있지 않습니다.',
        );

      await this.socketService.setSocketStatus(socketEntryCode, 'pending');

      this._socketEntryCode = socketEntryCode;

      console.log('일렉트론 기본 방', appClient.rooms);

      appClient.emit('invite-room', { message: '라이엇 계정 인증 성공', data: null });
    } catch (error) {
      console.error(`일렉트론 소켓 연결 실패 (id: ${appClient.id})`);
      appClient.emit('handle-connection-error', error);
      appClient.disconnect(true);
    }
  }

  async handleDisconnect(@ConnectedSocket() appClient: Socket): Promise<void> {
    console.log(`종료된 일렉트론 소켓 (id: ${appClient.id})`);

    await this.socketService.delSocketStatus(this._socketEntryCode);

    this.socketService.emitToWeb(
      'app-not-found',
      this._socketEntryCode,
      '일렉트론 앱이 종료되었습니다.',
    );
  }

  @SubscribeMessage('join-room')
  handleJoinRoom(
    @ConnectedSocket() appClient: Socket,
    @MessageBody() body: { socketEntryCode: string },
  ): void {
    const { socketEntryCode } = body;

    appClient.join(socketEntryCode);

    console.log('일렉트론 puuid 방 추가', appClient.rooms);

    appClient.emit('join-room-reply', { message: '서버 방 참여 성공', data: null });
  }

  @SubscribeMessage('game-status')
  handleGameStatus(
    @ConnectedSocket() webClient: Socket,
    @MessageBody() body: { gameStatus: string },
  ): void {
    const { gameStatus } = body;

    this.socketService.emitToWeb('game-status', this._socketEntryCode, gameStatus);
  }

  @SubscribeMessage('disconnect-request')
  async handleDisconnectRequest(@MessageBody() body: { socketEntryCode: string }): Promise<void> {
    const { socketEntryCode } = body;

    await this.socketService.delSocketStatus(socketEntryCode);
  }
}
