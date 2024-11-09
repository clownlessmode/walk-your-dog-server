import { ApiProperty } from '@nestjs/swagger';
import { DefaultEntity } from 'src/common/default.entity';
import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { MainService } from 'src/service/entities/main-service.entity';

@Entity()
export class Abonement extends DefaultEntity {
  @ManyToOne(() => MainService, { eager: true })
  @JoinColumn({ name: 'abonementTypeId' })
  @ApiProperty({
    type: () => MainService,
    description: 'References the ID of a MainService',
  })
  abonementType: MainService;

  @Column()
  @ApiProperty({ example: '50' })
  total: number;

  @Column()
  @ApiProperty({ example: '1990' })
  price: number;
}
