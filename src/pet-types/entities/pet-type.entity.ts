import { ApiProperty } from '@nestjs/swagger';
import { DefaultEntity } from 'src/common/default.entity';
import { Column, Entity } from 'typeorm';

@Entity()
export class PetType extends DefaultEntity {
  @ApiProperty({
    example: 'Собака',
    uniqueItems: true,
  })
  @Column({ unique: true })
  type: string;
}
