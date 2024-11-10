// src/service/entities/service.entity.ts
import { DefaultEntity } from 'src/common/default.entity';
import { SubService } from './sub-service.entity';
import { MainService } from './main-service.entity';
import { Column, Entity, ManyToOne, OneToMany } from 'typeorm';
import { User } from 'src/users/entites/user.entity';
import { Pet } from 'src/pets/entities/pet.entity';
import { Address } from 'src/adresses/entities/address.entity';

export enum Status {
  DONE = 'done',
  IN_PROGRESS = 'in-progress',
  CANCELLED = 'cancelled',
  TRANSFERRED = 'transferred',
  REPORT = 'report',
  SEARCH = 'search',
  WAITING_PAYMENT = 'waiting payment',
}

@Entity()
export class Service extends DefaultEntity {
  @ManyToOne(() => MainService, { nullable: false })
  mainService: MainService;

  @ManyToOne(() => User, { nullable: true })
  worker?: User | null;

  @ManyToOne(() => User, { nullable: false })
  customer: User;

  @ManyToOne(() => Pet, { nullable: false })
  pet: Pet;

  @OneToMany(() => SubService, (subService) => subService.service, {
    cascade: true,
    eager: true,
  })
  subServices: SubService[];

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  price: number;

  @Column({ default: false })
  isPayed: boolean;

  @Column({ type: 'timestamp' })
  datetime: Date;

  @Column({ type: 'enum', enum: Status, default: Status.WAITING_PAYMENT })
  status: Status;

  @Column({ type: 'text', nullable: true })
  comment?: string;

  @ManyToOne(() => Address)
  address: Address;

  @Column({ type: 'text', nullable: true })
  payment_link?: string | null;
}
