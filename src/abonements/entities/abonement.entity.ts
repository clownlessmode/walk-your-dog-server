import { ApiProperty } from '@nestjs/swagger';
import { DefaultEntity } from 'src/common/default.entity';
import { Column, Entity } from 'typeorm';
import { AbonementType } from '../enums/abonementType.enum';

@Entity()
export class Abonement extends DefaultEntity {
  @Column({ type: 'enum', enum: AbonementType })
  @ApiProperty({ example: 'WALKING' })
  abonementType: AbonementType;

  @Column()
  @ApiProperty({ example: '50' })
  total: number;

  @Column()
  @ApiProperty({ example: '1990' })
  price: number;
}
