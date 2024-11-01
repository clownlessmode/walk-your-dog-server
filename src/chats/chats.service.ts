import { Injectable } from '@nestjs/common';
import { Socket } from 'socket.io';
import { EntityManager } from 'typeorm';
import { Message } from './entities/message.entity';
import { User } from 'src/users/entites/user.entity';
import { Dialog } from './entities/dialog.entity';
import { CreateDialogDto } from './dto/createDialog.dto';

@Injectable()
export class ChatsService {
  constructor(private readonly manager: EntityManager) {}

  // Хранение активных сокетов пользователей
  private userSockets: Map<string, Socket> = new Map();

  // Присоединение пользователя к чату и отправка непрочитанных сообщений
  async joinUser(userId: string, socket: Socket) {
    this.userSockets.set(userId, socket);
    const unreadMessages = await this.manager.find(Message, {
      where: { to: { id: userId }, isRead: false },
      relations: ['from'],
    });

    unreadMessages.forEach((message) => {
      socket.emit('message', {
        id: message.id,
        from: message.from.id,
        content: message.content,
        created_at: message.created_at,
      });
    });
  }

  // Отключение пользователя
  leaveUser(socket: Socket) {
    for (const [userId, userSocket] of this.userSockets.entries()) {
      if (userSocket === socket) {
        this.userSockets.delete(userId);
        break;
      }
    }
  }

  // Поиск или создание нового диалога между двумя пользователями
  async findOrCreateDialog(user1Id: string, user2Id: string): Promise<Dialog> {
    let dialog = await this.manager.findOne(Dialog, {
      where: [
        { user1: { id: user1Id }, user2: { id: user2Id } },
        { user1: { id: user2Id }, user2: { id: user1Id } },
      ],
      relations: ['user1', 'user2'],
    });

    if (!dialog) {
      const user1 = await this.manager.findOne(User, {
        where: { id: user1Id },
      });
      const user2 = await this.manager.findOne(User, {
        where: { id: user2Id },
      });
      dialog = this.manager.create(Dialog, { user1, user2 });
      await this.manager.save(Dialog, dialog);
    }

    return dialog;
  }

  // Отправка сообщения от одного пользователя другому и добавление его в диалог
  async sendMessage(fromId: string, toId: string, content: string) {
    const fromUser = await this.manager.findOne(User, {
      where: { id: fromId },
    });
    const toUser = await this.manager.findOne(User, { where: { id: toId } });

    if (!fromUser || !toUser) {
      throw new Error('User not found');
    }

    const dialog = await this.findOrCreateDialog(fromId, toId);

    const message = this.manager.create(Message, {
      from: fromUser,
      to: toUser,
      content,
      dialog,
      isRead: false,
    });

    await this.manager.save(Message, message);

    // Обновляем информацию о последнем сообщении в диалоге
    dialog.lastMessage = content;
    dialog.updated_at = new Date().toISOString();
    await this.manager.save(Dialog, dialog);

    return message;
  }

  // Отметка сообщения как прочитанного
  async markAsRead(messageId: string) {
    const message = await this.manager.findOne(Message, {
      where: { id: messageId },
    });
    if (message) {
      message.isRead = true;
      await this.manager.save(Message, message);
    }
  }

  // Получение всех сообщений для конкретного диалога
  async getConversation(dialogId: string) {
    return this.manager.find(Message, {
      where: { dialog: { id: dialogId } },
      order: { created_at: 'ASC' },
      relations: ['from', 'to'],
    });
  }

  // Получение списка всех диалогов пользователя
  async getUserDialogs(userId: string) {
    return this.manager.find(Dialog, {
      where: [{ user1: { id: userId } }, { user2: { id: userId } }],
      relations: ['user1', 'user2'],
      order: { updated_at: 'DESC' },
    });
  }

  // Получение сокета пользователя
  getUserSocket(userId: string): Socket | undefined {
    return this.userSockets.get(userId);
  }

  // Новый метод для создания диалога между двумя пользователями
  async createDialog(dto: CreateDialogDto): Promise<Dialog> {
    const user1 = await this.manager.findOne(User, {
      where: { id: dto.user1Id },
    });
    const user2 = await this.manager.findOne(User, {
      where: { id: dto.user2Id },
    });

    if (!user1 || !user2) {
      throw new Error('User not found');
    }

    // Проверка существования диалога между пользователями
    const existingDialog = await this.manager.findOne(Dialog, {
      where: [
        { user1: { id: dto.user1Id }, user2: { id: dto.user1Id } },
        { user1: { id: dto.user2Id }, user2: { id: dto.user2Id } },
      ],
    });

    if (existingDialog) {
      return existingDialog;
    }

    const dialog = this.manager.create(Dialog, { user1, user2 });
    await this.manager.save(Dialog, dialog);

    return dialog;
  }
}
