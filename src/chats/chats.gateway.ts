import {
  WebSocketGateway,
  SubscribeMessage,
  MessageBody,
  ConnectedSocket,
  OnGatewayConnection,
  OnGatewayDisconnect,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { ChatsService } from './chats.service';
import { Logger } from '@nestjs/common';

@WebSocketGateway({
  cors: {
    origin: ['http://localhost:5173'], // Ваш фронтенд URL
    credentials: true,
  },
})
export class ChatsGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  private logger = new Logger('ChatsGateway');

  constructor(private readonly chatsService: ChatsService) {}

  // Обрабатываем подключение пользователя к серверу
  async handleConnection(client: Socket) {
    this.logger.log(`Client connected: ${client.id}`);
  }

  // Обрабатываем отключение пользователя
  async handleDisconnect(client: Socket) {
    this.logger.log(`Client disconnected: ${client.id}`);
    this.chatsService.leaveUser(client);
  }

  // Обработка подключения пользователя к чату
  @SubscribeMessage('join')
  async handleJoin(
    @MessageBody() data: { userId: string },
    @ConnectedSocket() client: Socket
  ) {
    this.logger.log(
      `User ${data.userId} joined chat with socket ID: ${client.id}`
    );
    await this.chatsService.joinUser(data.userId, client);
  }

  // Обработка отправки сообщения
  @SubscribeMessage('sendMessage')
  async handleSendMessage(
    @MessageBody() data: { from: string; to: string; content: string },
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    @ConnectedSocket() _client: Socket // Используем _client, так как не нужен внутри метода
  ) {
    this.logger.log(`Message from ${data.from} to ${data.to}: ${data.content}`);

    // Отправка сообщения и привязка к диалогу
    const message = await this.chatsService.sendMessage(
      data.from,
      data.to,
      data.content
    );

    // Находим активный сокет получателя и отправляем сообщение, если он онлайн
    const toSocket = this.chatsService.getUserSocket(data.to);
    if (toSocket) {
      toSocket.emit('message', {
        id: message.id,
        from: message.from.id,
        to: message.to.id,
        content: message.content,
        created_at: message.created_at,
      });
    }
  }

  // Обработка запроса на получение всех сообщений для конкретного диалога
  @SubscribeMessage('getConversation')
  async handleGetConversation(
    @MessageBody() data: { user1Id: string; user2Id: string },
    @ConnectedSocket() client: Socket
  ) {
    this.logger.log(
      `Fetching conversation between ${data.user1Id} and ${data.user2Id}`
    );

    // Получаем или создаем диалог
    const dialog = await this.chatsService.findOrCreateDialog(
      data.user1Id,
      data.user2Id
    );

    // Получаем все сообщения для диалога
    const conversation = await this.chatsService.getConversation(dialog.id);
    client.emit('conversation', conversation);
  }

  // Обработка запроса на получение списка диалогов пользователя
  @SubscribeMessage('getDialogs')
  async handleGetDialogs(
    @MessageBody() data: { userId: string },
    @ConnectedSocket() client: Socket
  ) {
    this.logger.log(`Fetching all dialogs for user: ${data.userId}`);

    const dialogs = await this.chatsService.getUserDialogs(data.userId);
    client.emit('dialogs', dialogs);
  }
}
