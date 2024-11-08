import { DefaultEntity } from 'src/common/default.entity';
import { Column, Entity, JoinColumn, ManyToOne, OneToMany } from 'typeorm';
import { Additional } from './additional.entity';
@Entity()
export class ServiceValue extends DefaultEntity {
  @Column({ type: 'varchar', length: 255 })
  name: string;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  price: string;

  @OneToMany(() => Additional, (additional) => additional.serviceValue, {
    cascade: true,
    eager: true,
  })
  additional: Additional[];
}
