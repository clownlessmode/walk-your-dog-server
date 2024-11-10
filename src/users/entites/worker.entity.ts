import { Column, Entity, JoinTable, ManyToMany } from 'typeorm';
import { DefaultEntity } from '../../common/default.entity';
import { ApiProperty } from '@nestjs/swagger';
import { ArrayMinSize, IsArray, IsOptional, Matches } from 'class-validator';
import { PetType } from 'src/pet-types/entities/pet-type.entity';
import { MainService } from 'src/service/entities/main-service.entity';

@Entity()
export class Worker extends DefaultEntity {
  @Column({ type: 'time' })
  @ApiProperty({
    example: '7:00',
    description: 'Время начала в формате HH:MM',
  })
  @Matches(/^([0-1]\d|2[0-3]):([0-5]\d)$/, {
    message: 'Время должно быть в формате HH:MM',
  })
  start: string;

  @Column({ type: 'time' })
  @ApiProperty({
    example: '18:00',
    description: 'Время конца в формате HH:MM',
  })
  @Matches(/^([0-1]\d|2[0-3]):([0-5]\d)$/, {
    message: 'Время должно быть в формате HH:MM',
  })
  end: string;

  @ApiProperty({
    description:
      'Дни недели для повтора напоминания (1 - понедельник, ..., 7 - воскресенье)',
    example: [1, 3, 5],
    required: true,
  })
  @IsArray()
  @IsOptional()
  @ArrayMinSize(0)
  @Column('simple-array')
  days: number[];

  @ManyToMany(() => PetType, { cascade: true })
  @JoinTable()
  @ApiProperty({
    isArray: true,
  })
  petTypes: PetType[];

  @ManyToMany(() => MainService, { cascade: true })
  @JoinTable()
  @ApiProperty({
    isArray: true,
  })
  services: MainService[];
}
