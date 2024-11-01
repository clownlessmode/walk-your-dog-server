import { ApiProperty } from '@nestjs/swagger';
import { DefaultEntity } from 'src/common/default.entity';
import { Column, Entity, ManyToMany, JoinTable } from 'typeorm';
import { gender } from '../enums/gender.enum';
import { Vaccine } from 'src/vaccines/entities/vaccine.entity';

@Entity()
export class PetParameters extends DefaultEntity {
  @Column({ type: 'enum', enum: gender })
  @ApiProperty({ example: 'MALE' })
  gender: gender;

  @Column()
  @ApiProperty({
    example: true,
  })
  sterilized: boolean;

  @Column()
  @ApiProperty({
    example: true,
  })
  aggressive: boolean;

  @Column()
  @ApiProperty({
    example: true,
  })
  pulls: boolean;

  @Column()
  @ApiProperty({
    example: 'Общее состояние хорошее',
  })
  health: string;

  @Column()
  @ApiProperty({
    example: 'Есть грыжа на пятке',
  })
  additional: string;

  @ManyToMany(() => Vaccine, { cascade: true })
  @JoinTable()
  @ApiProperty({
    type: () => [Vaccine],
    description: 'Список прививок питомца',
  })
  vaccines: Vaccine[];
}
