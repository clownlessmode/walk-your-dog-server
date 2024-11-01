import { ApiProperty } from '@nestjs/swagger';
import { DefaultEntity } from 'src/common/default.entity';
import { Column, Entity } from 'typeorm';

@Entity()
export class Service extends DefaultEntity {
  @Column()
  @ApiProperty({ example: '«Канивак CH» (чума + гепатит)' })
  name: string;
}
