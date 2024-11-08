import { ApiProperty } from '@nestjs/swagger';
import {
  IsBoolean,
  IsDateString,
  IsEnum,
  IsNumber,
  IsOptional,
  IsString,
  IsUUID,
} from 'class-validator';
import { Status } from '../entities/service.entity';

export class CreateServiceDto {
  @ApiProperty({
    description: 'ID основной услуги',
    example: 'da1eabac-46e1-4c8b-8fc0-ec7b47d2d4b9',
  })
  @IsUUID()
  mainServiceId: string;

  @ApiProperty({
    description: 'ID заказчика услуги',
    example: 'da1eabac-46e1-4c8b-8fc0-ec7b47d2d4b9',
  })
  @IsUUID()
  customerId: string;

  @ApiProperty({
    description: 'ID питомца, получающего услугу',
    example: 'da1eabac-46e1-4c8b-8fc0-ec7b47d2d4b9',
  })
  @IsUUID()
  petId: string;

  @ApiProperty({
    description: 'Список ID дополнительных услуг',
    example: ['da1eabac-46e1-4c8b-8fc0-ec7b47d2d4b9'],
    type: [String],
  })
  @IsUUID('all', { each: true })
  subServiceIds: string[];

  @ApiProperty({
    description: 'Дата и время оказания услуги',
    example: '2024-11-08T12:43:12.425Z',
  })
  @IsDateString()
  datetime: Date;

  @ApiProperty({
    description: 'Комментарий к услуге',
    example: 'Питомец любит активные прогулки.',
    nullable: true,
  })
  @IsString()
  @IsOptional()
  comment?: string;

  @ApiProperty({
    description: 'ID адреса выполнения услуги',
    example: 'da1eabac-46e1-4c8b-8fc0-ec7b47d2d4b9',
  })
  @IsUUID()
  addressId: string;
}
