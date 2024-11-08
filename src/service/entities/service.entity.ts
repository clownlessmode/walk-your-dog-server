import { User } from 'src/users/entites/user.entity';
import { Column, Entity, ManyToOne, OneToMany } from 'typeorm';
import { ServiceItem } from './service-item.entity';
import { DefaultEntity } from 'src/common/default.entity';

@Entity()
export class Service extends DefaultEntity {
  @ManyToOne(() => User, { nullable: false })
  customer: User;

  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
  totalPrice: number;

  @OneToMany(() => ServiceItem, (item) => item.service, { cascade: true })
  items: ServiceItem[];

  @Column({ type: 'boolean', default: false })
  isPaid: boolean;
}
