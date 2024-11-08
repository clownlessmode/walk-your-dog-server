import { ApiProperty } from '@nestjs/swagger';
import { IsDecimal, IsNumber, IsString } from 'class-validator';

export class CreateMainServiceDto {
  @ApiProperty({
    description: 'Название основной услуги',
    example: 'Выгул',
  })
  @IsString()
  name: string;

  @ApiProperty({
    description: 'Цена основной услуги в формате с десятичной точкой',
    example: 15.99,
    type: Number,
  })
  @IsNumber(
    { maxDecimalPlaces: 2 },
    { message: 'price должен быть числом с максимум двумя десятичными знаками' }
  )
  price: number;
}
