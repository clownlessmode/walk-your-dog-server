import { ApiProperty } from '@nestjs/swagger';
import { Balance } from 'src/balance/entities/balance.entity';
import { DefaultEntity } from 'src/common/default.entity';
import { Status } from 'src/service/entities/service.entity';
import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';

@Entity()
export class Payment extends DefaultEntity {
  @Column()
  @ApiProperty({ example: 'deposit | withdrawal | donation' })
  type: string;

  @Column()
  @ApiProperty({ example: 1000 })
  total: number;

  @ManyToOne(() => Balance)
  @JoinColumn()
  @ApiProperty({ type: () => Balance })
  balanceId: Balance;
}
