import { ApiProperty } from '@nestjs/swagger';
import { IsDecimal, IsNumber, IsString, IsUUID } from 'class-validator';

export class CreateSubServiceDto {
  @ApiProperty({
    description: 'Название основной услуги',
    example: 'Выгул',
  })
  @IsString()
  name: string;

  @ApiProperty({
    description: 'Цена основной услуги в формате с десятичной точкой',
    example: 15.99,
  })
  @IsNumber()
  price: number;

  @ApiProperty({ example: 'UUID OF MAIN SERVICE!!!!!!' })
  @IsUUID('4')
  main_id: string;
}
