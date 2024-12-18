import { ApiProperty } from '@nestjs/swagger';
import { DefaultEntity } from 'src/common/default.entity';
import { Meta } from 'src/users/entites/meta.entity';
import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
@Entity()
export class Address extends DefaultEntity {
  @Column()
  address: string;

  @Column({ type: 'float' })
  lon: number;

  @Column({ type: 'float' })
  lat: number;

  @Column({ default: null, nullable: true })
  apartment: string | null;

  @Column({ default: null, nullable: true })
  entrance: string | null;

  @Column({ default: null, nullable: true })
  doorcode: string | null;

  @ManyToOne(() => Meta, (meta) => meta.addresses)
  @JoinColumn()
  @ApiProperty({ type: () => Meta })
  owner: Meta;
}
