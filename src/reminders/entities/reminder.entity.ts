import { ApiProperty } from '@nestjs/swagger';
import { DefaultEntity } from 'src/common/default.entity';
import { Column, Entity, JoinTable, ManyToMany } from 'typeorm';
import { reminderType } from '../enums/reminderType.enum';
import { Pet } from 'src/pets/entities/pet.entity';

@Entity()
export class Reminder extends DefaultEntity {
  @Column({ type: 'enum', enum: reminderType })
  @ApiProperty({ example: 'SUBSCRIBE' })
  reminderType: reminderType;

  @ManyToMany(() => Pet, (pet) => pet.reminders)
  @JoinTable()
  @ApiProperty({ type: () => [Pet] })
  pets: Pet[];

  @Column({ type: 'timestamp' })
  @ApiProperty({ example: '2022-01-01T12:34:56.789Z' })
  datetime: Date;

  @Column()
  @ApiProperty({ example: 3 })
  remind: number;

  @Column('int', { array: true, nullable: true, default: [] })
  @ApiProperty({
    description:
      'Дни недели для повтора напоминания (1 - понедельник, ..., 7 - воскресенье)',
    example: [1, 3, 5],
  })
  repeatDays: number[];
}
