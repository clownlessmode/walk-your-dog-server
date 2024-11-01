import { DefaultEntity } from 'src/common/default.entity';
import { User } from 'src/users/entites/user.entity';
import { Entity, Column, ManyToOne, JoinColumn } from 'typeorm';
import { Dialog } from './dialog.entity';

@Entity()
export class Message extends DefaultEntity {
  @ManyToOne(() => User, (user) => user.sentMessages)
  @JoinColumn({ name: 'fromUserId' })
  from: User;

  @ManyToOne(() => User, (user) => user.receivedMessages)
  @JoinColumn({ name: 'toUserId' })
  to: User;

  @Column()
  content: string;

  @Column({ default: false })
  isRead: boolean;

  @ManyToOne(() => Dialog, (dialog) => dialog.messages)
  @JoinColumn({ name: 'dialogId' })
  dialog: Dialog;
}
