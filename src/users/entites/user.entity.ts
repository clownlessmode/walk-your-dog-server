import { ApiProperty } from '@nestjs/swagger';
import { DefaultEntity } from 'src/common/default.entity';
import { Column, Entity, JoinColumn, OneToMany, OneToOne } from 'typeorm';
import { Meta } from './meta.entity';
import { Message } from 'src/chats/entities/message.entity';
import { Dialog } from 'src/chats/entities/dialog.entity';
import { Pet } from 'src/pets/entities/pet.entity';
import { Balance } from 'src/balance/entities/balance.entity';
import { UserAbonement } from 'src/abonements/entities/userAbonement.entity';

@Entity()
export class User extends DefaultEntity {
  @OneToOne(() => Meta, { cascade: true })
  @JoinColumn()
  @ApiProperty({ example: Meta })
  meta: Meta;

  @Column()
  @ApiProperty({
    example:
      'yJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjM3NGQ3YTc2LTVmYWEtNDljYS1iNzlAS^DTAS^&*DT&*SADY&*ASHDU78IjoxNzI2OTAzNDA0fQ.AgUaYt9g8PM86HpXG1zBV5bm6NV-i2A4325dfvzS84',
  })
  refreshToken: string;

  @OneToMany(() => Message, (message) => message.from)
  sentMessages: Message[];

  @OneToMany(() => Message, (message) => message.to)
  receivedMessages: Message[];

  @OneToMany(() => Dialog, (dialog) => dialog.user1)
  dialogsInitiated: Dialog[];

  @OneToMany(() => Dialog, (dialog) => dialog.user2)
  dialogsReceived: Dialog[];

  @OneToMany(() => Pet, (pet) => pet.owner)
  @ApiProperty({ type: () => Pet, isArray: true })
  pets: Pet[];

  @OneToOne(() => Balance, { cascade: true })
  @JoinColumn()
  @ApiProperty({ example: Balance })
  balance: Balance;

  @OneToMany(() => UserAbonement, (userAbonement) => userAbonement.user, {
    cascade: true,
  })
  @ApiProperty({ type: () => UserAbonement, isArray: true })
  abonements: UserAbonement[];

  /*
  @OneToOne(() => Worker, { cascade: true, nullable: true })
  @JoinColumn()
  worker?: Worker | null;
  */
}
