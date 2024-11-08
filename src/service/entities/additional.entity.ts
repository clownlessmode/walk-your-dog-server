import { DefaultEntity } from 'src/common/default.entity';
import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { ServiceValue } from './service-value.entity';
@Entity()
export class Additional extends DefaultEntity {
  @Column({ type: 'varchar', length: 255 })
  name: string;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  price: string;

  @ManyToOne(() => ServiceValue, (serviceValue) => serviceValue.additional, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'service_value_id' })
  serviceValue: ServiceValue;
}
