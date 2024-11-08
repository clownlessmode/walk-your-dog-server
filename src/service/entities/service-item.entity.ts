import { DefaultEntity } from 'src/common/default.entity';
import { SubService } from './sub-service.entity';
import { MainService } from './main-service.entity';
import { Column, Entity, ManyToOne, OneToMany } from 'typeorm';
import { User } from 'src/users/entites/user.entity';
import { Pet } from 'src/pets/entities/pet.entity';

@Entity()
export class ServiceItem extends DefaultEntity {
  @ManyToOne(() => MainService, { nullable: false })
  mainService: MainService;

  @ManyToOne(() => User, { nullable: true })
  worker?: User | null;

  @ManyToOne(() => Pet, { nullable: false })
  pet: Pet;

  @OneToMany(() => SubService, (subService) => subService.serviceItem, {
    cascade: true,
    eager: true,
  })
  subServices: SubService[];

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  price: number;
}
