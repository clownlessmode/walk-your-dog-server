import { ApiProperty } from '@nestjs/swagger';
import { DefaultEntity } from 'src/common/default.entity';
import { Entity, Column, ManyToOne, JoinColumn } from 'typeorm';
import { Abonement } from './abonement.entity';
import { User } from 'src/users/entites/user.entity';

@Entity()
export class UserAbonement extends DefaultEntity {
  @ManyToOne(() => User, (user) => user.abonements)
  @JoinColumn({ name: 'userId' })
  @ApiProperty({ example: 'e1b2f3d4-5678-9abc-def0-1234567890ab' })
  user: User;

  @ManyToOne(() => Abonement)
  @JoinColumn({ name: 'abonementId' })
  @ApiProperty({ type: () => Abonement })
  abonement: Abonement;

  @Column()
  @ApiProperty({ example: 50, description: 'Оставшиеся' })
  remaining: number;

  @Column({ type: 'timestamp', nullable: true })
  @ApiProperty({
    example: '2025-10-30T12:00:00Z',
    description: 'Дата истечения срока абонемента',
  })
  expiresAt: Date;
}
