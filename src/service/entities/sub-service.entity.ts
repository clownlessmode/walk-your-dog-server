import { DefaultEntity } from 'src/common/default.entity';
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { ServiceItem } from './service-item.entity';

@Entity()
export class SubService extends DefaultEntity {
  @Column({ type: 'uuid' })
  main_id: string;

  @Column({ type: 'varchar', length: 255 })
  name: string;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  price: number;

  @ManyToOne(() => ServiceItem, (orderItem) => orderItem.subServices, {
    onDelete: 'CASCADE',
  })
  serviceItem: ServiceItem;
}
