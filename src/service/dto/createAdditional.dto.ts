import { ApiProperty } from '@nestjs/swagger';
import { IsDecimal, IsNotEmpty, IsString, MaxLength } from 'class-validator';

export class CreateAdditionalDto {
  @ApiProperty({
    description: 'Название дополнительной услуги',
    example: 'Дополнительная гарантия',
  })
  @IsString()
  @IsNotEmpty()
  @MaxLength(255)
  name: string;

  @ApiProperty({
    description: 'Цена дополнительной услуги',
    example: '49.99',
    type: String,
  })
  @IsDecimal(
    { decimal_digits: '2' },
    { message: 'Цена должна быть числом с двумя знаками после запятой' }
  )
  price: string;
}
