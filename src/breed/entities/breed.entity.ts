import { ApiProperty } from '@nestjs/swagger';
import { DefaultEntity } from 'src/common/default.entity';
import { PetType } from 'src/pet-types/entities/pet-type.entity';
import { Column, Entity, ManyToOne, JoinColumn } from 'typeorm';

@Entity()
export class Breed extends DefaultEntity {
  @ApiProperty({
    example: 'Китайская хохлатая',
    uniqueItems: true,
  })
  @Column({ unique: true })
  name: string;

  @ManyToOne(() => PetType, { cascade: true })
  @JoinColumn()
  @ApiProperty({
    example: {
      id: 'e1b2f3d4-5678-9abc-def0-1234567890ab',
      type: 'Собака',
      created_at: '2024-09-21T12:34:56.789Z',
      updated_at: '2024-09-21T12:34:56.789Z',
    },
  })
  petType: PetType;
}
