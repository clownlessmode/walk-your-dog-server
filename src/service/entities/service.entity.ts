import { ApiProperty } from '@nestjs/swagger';
import { DefaultEntity } from 'src/common/default.entity';
import { Column, Entity, JoinColumn, OneToOne } from 'typeorm';
import { IsEnum, IsOptional } from 'class-validator';
import { AbonementType } from '../../abonements/enums/abonementType.enum';
import { Additional } from '../enums/additional.enum';
import { Pet } from '../../pets/entities/pet.entity';
import { ServiceStatus } from '../enums/status.enum';
import { User } from '../../users/entites/user.entity';
import { Address } from '../../adresses/entities/address.entity';

@Entity()
export class Service extends DefaultEntity {
  @ApiProperty({
    example: 'WALKING',
    description: 'Тип услуги, например, прогулка',
  })
  @Column({
    type: 'enum',
    enum: AbonementType,
  })
  @IsEnum(AbonementType)
  type: AbonementType;

  @ApiProperty({
    example: ['FEED', 'WALKING'],
    isArray: true,
    required: false,
    description: 'Дополнительные услуги',
  })
  @Column({
    type: 'enum',
    enum: Additional,
    array: true,
    nullable: true,
  })
  @IsEnum(Additional, { each: true })
  @IsOptional()
  additional?: Additional[];

  @OneToOne(() => Pet, { cascade: true, nullable: true })
  @JoinColumn()
  @ApiProperty({
    description: 'Домашнее животное, к которому относится услуга',
    type: () => Pet,
    required: false,
  })
  @IsOptional()
  pet?: Pet;

  @OneToOne(() => User, { cascade: true, nullable: true })
  @JoinColumn()
  @ApiProperty({
    description: 'Работник, выполняющий услугу',
    type: () => User,
    required: false,
  })
  @IsOptional()
  worker?: User;

  @OneToOne(() => User, { cascade: true, nullable: true })
  @JoinColumn()
  @ApiProperty({
    description: 'Клиент, заказавший услугу',
    type: () => User,
    required: false,
  })
  @IsOptional()
  client?: User;

  @OneToOne(() => Address, { cascade: true, nullable: true })
  @JoinColumn()
  @ApiProperty({
    description: 'Адрес, на котором выполняется услуга',
    type: () => Address,
    required: false,
  })
  @IsOptional()
  address?: Address;

  @Column({
    type: 'timestamp',
  })
  @ApiProperty({
    example: '2023-11-05T18:30:00Z',
    description: 'Дата и время выполнения услуги в формате ISO 8601',
  })
  date_time: Date;

  @ApiProperty({
    example: 'SEARCH',
    description: 'Статус услуги',
    enum: ServiceStatus,
    default: ServiceStatus.SEARCH,
  })
  @Column({
    type: 'enum',
    enum: ServiceStatus,
    default: ServiceStatus.SEARCH,
  })
  @IsEnum(ServiceStatus)
  @IsOptional()
  status?: ServiceStatus;
}
