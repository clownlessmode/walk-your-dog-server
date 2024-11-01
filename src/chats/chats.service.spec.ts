import { Test, TestingModule } from '@nestjs/testing';
import { ChatsService } from './chats.service';
import { EntityManager } from 'typeorm';
import { Message } from './entities/message.entity';
import { User } from 'src/users/entites/user.entity';
import { Dialog } from './entities/dialog.entity';

const mockEntityManager = () => ({
  find: jest.fn(),
  findOne: jest.fn(),
  create: jest.fn(),
  save: jest.fn(),
});

describe('ChatsService', () => {
  let service: ChatsService;
  let manager: jest.Mocked<EntityManager>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ChatsService,
        { provide: EntityManager, useFactory: mockEntityManager },
      ],
    }).compile();

    service = module.get<ChatsService>(ChatsService);
    manager = module.get<EntityManager>(
      EntityManager
    ) as jest.Mocked<EntityManager>;
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('joinUser', () => {
    it('should add socket to userSockets and emit unread messages', async () => {
      const userId = 'user1';
      const socket = { emit: jest.fn() } as any;
      const messages = [
        {
          id: 'msg1',
          from: { id: 'user2' },
          content: 'Hello',
          created_at: new Date(),
        },
      ];

      manager.find.mockResolvedValue(messages);

      await service.joinUser(userId, socket);

      expect(service['userSockets'].get(userId)).toEqual(socket);
      expect(socket.emit).toHaveBeenCalledWith('message', {
        id: 'msg1',
        from: 'user2',
        content: 'Hello',
        created_at: messages[0].created_at,
      });
    });
  });

  describe('findOrCreateDialog', () => {
    it('should find an existing dialog between two users', async () => {
      const user1Id = 'user1';
      const user2Id = 'user2';
      const existingDialog = {
        id: 'dialog1',
        user1: { id: user1Id },
        user2: { id: user2Id },
      } as Dialog;

      manager.findOne.mockResolvedValueOnce(existingDialog);

      const dialog = await service.findOrCreateDialog(user1Id, user2Id);

      expect(dialog).toEqual(existingDialog);
      expect(manager.findOne).toHaveBeenCalledWith(Dialog, {
        where: [
          { user1: { id: user1Id }, user2: { id: user2Id } },
          { user1: { id: user2Id }, user2: { id: user1Id } },
        ],
        relations: ['user1', 'user2'],
      });
    });

    it('should create a new dialog if not found', async () => {
      const user1Id = 'user1';
      const user2Id = 'user2';
      const user1 = { id: user1Id } as User;
      const user2 = { id: user2Id } as User;
      const newDialog = { id: 'dialog2', user1, user2 } as Dialog;

      manager.findOne.mockResolvedValueOnce(null); // No dialog found
      manager.findOne.mockResolvedValueOnce(user1); // Find user1
      manager.findOne.mockResolvedValueOnce(user2); // Find user2
      manager.create.mockReturnValue(newDialog as unknown as Dialog[]);
      manager.save.mockResolvedValue(newDialog);

      const dialog = await service.findOrCreateDialog(user1Id, user2Id);

      expect(dialog).toEqual(newDialog);
      expect(manager.create).toHaveBeenCalledWith(Dialog, { user1, user2 });
      expect(manager.save).toHaveBeenCalledWith(Dialog, newDialog);
    });
  });

  describe('sendMessage', () => {
    it('should save message and emit to recipient if online', async () => {
      const fromId = 'user1';
      const toId = 'user2';
      const content = 'Hello';
      const fromUser = { id: fromId } as User;
      const toUser = { id: toId } as User;
      const createdAt = new Date().toISOString();

      const dialog = {
        id: 'dialog1',
        user1: fromUser,
        user2: toUser,
      } as Dialog;
      const savedMessage = {
        id: 'msg1',
        from: fromUser,
        to: toUser,
        content,
        isRead: false,
        dialog,
        created_at: createdAt, // Устанавливаем значение created_at
      } as Message;

      manager.findOne.mockResolvedValueOnce(fromUser);
      manager.findOne.mockResolvedValueOnce(toUser);
      manager.findOne.mockResolvedValueOnce(dialog);
      manager.create.mockReturnValue(savedMessage as unknown as Message[]);
      manager.save.mockResolvedValue(savedMessage);

      const toSocket = { emit: jest.fn() } as any;
      service['userSockets'].set(toId, toSocket);

      await service.sendMessage(fromId, toId, content);

      expect(manager.create).toHaveBeenCalledWith(Message, {
        from: fromUser,
        to: toUser,
        content,
        dialog,
        isRead: false,
      });
      expect(manager.save).toHaveBeenCalledWith(Message, savedMessage);
      expect(toSocket.emit).toHaveBeenCalledWith('message', {
        id: 'msg1',
        from: fromId,
        to: toId,
        content,
        created_at: createdAt, // Обновляем ожидание для поля created_at
      });
    });

    it('should throw an error if user not found', async () => {
      manager.findOne.mockResolvedValueOnce(null);
      await expect(
        service.sendMessage('user1', 'user2', 'Hello')
      ).rejects.toThrow('User not found');
    });
  });

  describe('markAsRead', () => {
    it('should mark message as read', async () => {
      const message = { id: 'msg1', isRead: false } as Message;
      manager.findOne.mockResolvedValue(message);

      await service.markAsRead('msg1');

      expect(message.isRead).toBe(true);
      expect(manager.save).toHaveBeenCalledWith(Message, message);
    });
  });

  describe('getConversation', () => {
    it('should return conversation for a specific dialog', async () => {
      const dialogId = 'dialog1';
      const messages = [
        {
          id: 'msg1',
          dialog: { id: dialogId },
          from: { id: 'user1' },
          to: { id: 'user2' },
          content: 'Hi',
        },
      ] as Message[];

      manager.find.mockResolvedValue(messages);

      const result = await service.getConversation(dialogId);

      expect(result).toEqual(messages);
      expect(manager.find).toHaveBeenCalledWith(Message, {
        where: { dialog: { id: dialogId } },
        order: { created_at: 'ASC' },
        relations: ['from', 'to'],
      });
    });
  });
});
