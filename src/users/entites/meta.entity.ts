import { ApiProperty } from '@nestjs/swagger';
import { DefaultEntity } from 'src/common/default.entity';
import { Column, Entity, OneToMany } from 'typeorm';
import { role } from '../enums/role.enum';
import { Address } from 'src/adresses/entities/address.entity';

@Entity()
export class Meta extends DefaultEntity {
  @Column({ nullable: true, default: null })
  @ApiProperty({
    example: 'https://i.ibb.co/GcmVjKd/placeholder-light.png',
  })
  image: string | null;

  @Column()
  @ApiProperty({
    example: '+71234567890',
  })
  telephone: string;

  @Column({ type: 'enum', enum: role })
  @ApiProperty({ example: 'CLIENT' })
  role: role;

  @Column()
  @ApiProperty({
    example: 'Иван Иванов',
  })
  name: string;

  @Column()
  @ApiProperty({
    example: 'Москва',
  })
  city: string;

  @OneToMany(() => Address, (address) => address.owner)
  @ApiProperty({ type: () => Address, isArray: true })
  addresses: Address[];

  @Column()
  @ApiProperty({
    example: 'IvanIvanov1900@rambler.io',
  })
  email: string;

  @Column()
  @ApiProperty({
    example: 'GX4PF',
  })
  promocode: string;

  //   @Column({ type: 'time' })
  //   @ApiProperty({
  //     example: '18:00',
  //   })
  //   worker_interval_start: string;

  //   @Column({ type: 'time' })
  //   @ApiProperty({
  //     example: '20:00',
  //   })
  //   worker_interval_end: string;

  //   @Column({ array: true })
  //   @ApiProperty({
  //     example: [1, 2, 3, 4, 7],
  //   })
  //   worker_days: number[];
}
