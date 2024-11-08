import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  ArrayMinSize,
  IsArray,
  IsDecimal,
  IsNotEmpty,
  IsString,
  MaxLength,
  ValidateNested,
} from 'class-validator';
import { CreateAdditionalDto } from './createAdditional.dto';

export class CreateServiceValueDto {
  @ApiProperty({
    description: 'Название сервиса',
    example: 'Премиум пакет',
  })
  @IsString()
  @IsNotEmpty()
  @MaxLength(255)
  name: string;

  @ApiProperty({
    description: 'Цена сервиса',
    example: '299.99',
    type: String,
  })
  @IsDecimal(
    { decimal_digits: '2' },
    { message: 'Цена должна быть числом с двумя знаками после запятой' }
  )
  price: string;

  @ApiProperty({
    description: 'Массив дополнительных услуг',
    type: [CreateAdditionalDto],
    example: [
      {
        name: 'Дополнительная поддержка',
        price: '19.99',
      },
      {
        name: 'Расширенная гарантия',
        price: '49.99',
      },
    ],
  })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateAdditionalDto)
  additional: CreateAdditionalDto[];
}
