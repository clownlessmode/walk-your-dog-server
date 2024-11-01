import { ApiProperty } from '@nestjs/swagger';
import { Breed } from 'src/breed/entities/breed.entity';
import { DefaultEntity } from 'src/common/default.entity';
import { User } from 'src/users/entites/user.entity';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToMany,
  ManyToOne,
  OneToOne,
} from 'typeorm';
import { PetParameters } from './petParameters.entity';
import { Reminder } from 'src/reminders/entities/reminder.entity';

@Entity()
export class Pet extends DefaultEntity {
  @Column()
  @ApiProperty({ example: 'Томас' })
  name: string;

  @ManyToOne(() => Breed, { nullable: true }) // Добавляем nullable здесь
  @JoinColumn()
  @ApiProperty({ type: () => Breed, required: false })
  breed?: Breed | null;

  @Column({ nullable: true, default: null })
  @ApiProperty({ example: 'https://i.ibb.co/GcmVjKd/placeholder-light.png' })
  image: string;

  @Column({ type: 'timestamp' })
  @ApiProperty({
    example: '2024-09-21T12:34:56.789Z',
  })
  birthdate: Date;

  @ManyToOne(() => User)
  @JoinColumn()
  @ApiProperty({ type: () => User })
  owner: User;

  @OneToOne(() => PetParameters, { cascade: true })
  @JoinColumn()
  @ApiProperty({ example: PetParameters })
  parameters: PetParameters;

  @ManyToMany(() => Reminder, (reminder) => reminder.pets)
  @ApiProperty({ type: () => [Reminder] })
  reminders: Reminder[];
}
