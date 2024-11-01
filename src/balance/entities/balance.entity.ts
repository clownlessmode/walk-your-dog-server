import { ApiProperty } from '@nestjs/swagger';
import { DefaultEntity } from 'src/common/default.entity';
import { Payment } from 'src/payments/entities/payment.entity';
import { Column, Entity, OneToMany } from 'typeorm';

@Entity()
export class Balance extends DefaultEntity {
  @Column({ default: 0 })
  @ApiProperty({ example: 0 })
  promo: number;

  @Column({ default: 0 })
  @ApiProperty({ example: 0 })
  general: number;

  @OneToMany(() => Payment, (payment) => payment.balanceId)
  @ApiProperty({ type: () => Payment, isArray: true })
  payments: Payment[];
}
