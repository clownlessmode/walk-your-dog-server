import {
  Entity,
  Column,
  OneToMany,
  ManyToOne,
  JoinColumn,
  Unique,
} from 'typeorm';
import { User } from 'src/users/entites/user.entity';
import { Message } from './message.entity';
import { DefaultEntity } from 'src/common/default.entity';

@Entity()
@Unique(['user1', 'user2'])
export class Dialog extends DefaultEntity {
  @ManyToOne(() => User, (user) => user.sentMessages)
  @JoinColumn({ name: 'user1Id' })
  user1: User;

  @ManyToOne(() => User, (user) => user.receivedMessages)
  @JoinColumn({ name: 'user2Id' })
  user2: User;

  @OneToMany(() => Message, (message) => message.dialog, { cascade: true })
  messages: Message[];

  @Column({ default: '' })
  lastMessage: string;
}
