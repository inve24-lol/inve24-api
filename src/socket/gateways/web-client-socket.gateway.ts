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
  namespace: '/ws/socket/web',
})
@WebSocketGateway()
export class WebClientSocketGateway
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

  async handleConnection(@ConnectedSocket() webClient: Socket) {
    try {
      const { authorization } = webClient.handshake.headers;

      if (!authorization) throw new UnauthorizedException('Auth 헤더가 존재하지 않습니다.');

      console.log(authorization);

      console.log(`웹 소켓 연결 시작 (id: ${webClient.id})`);
    } catch (error) {
      console.error(`에러로 인한 웹 소켓 연결 강제 종료 (id: ${webClient.id})`);
      webClient.disconnect(true);
    }
  }

  handleDisconnect(@ConnectedSocket() webClient: Socket) {
    console.log(`종료가 감지된 웹 소켓 (id: ${webClient.id})`);
  }

  @SubscribeMessage('join-room')
  handleJoinRoom(@ConnectedSocket() webClient: Socket, @MessageBody() body: { roomId: string }) {
    const { roomId } = body;

    webClient.join(roomId);

    this.server.to(roomId).emit('join-room-reply-web', {
      message: '데스크탑 어플리케이션과 연결되었습니다.',
      data: null,
    });
  }
}
