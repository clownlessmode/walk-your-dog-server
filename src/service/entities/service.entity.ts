import { DefaultEntity } from 'src/common/default.entity';
import { Entity } from 'typeorm';
import { ServiceValue } from './service-value.entity';

@Entity()
export class Service extends DefaultEntity {
  service: ServiceValue;
}
