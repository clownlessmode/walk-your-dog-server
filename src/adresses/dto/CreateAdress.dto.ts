import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsUUID, IsNumber } from 'class-validator';

export class CreateAddressDto {
  @ApiProperty({ example: 'г. Москва, ул. Пушкина, д. 12' })
  @IsString({ message: 'Адрес должен быть строкой' })
  @IsNotEmpty({ message: 'Адрес не может быть пустым' })
  address: string;

  @ApiProperty({ example: 55.75396 })
  @IsNumber({}, { message: 'Широта должна быть числом' })
  @IsNotEmpty({ message: 'Широта не может быть пустой' })
  lat: number;

  @ApiProperty({ example: 37.62037 })
  @IsNumber({}, { message: 'Долгота должна быть числом' })
  @IsNotEmpty({ message: 'Долгота не может быть пустой' })
  lon: number;

  @ApiProperty({ example: '123e4567-e89b-12d3-a456-426614174000' })
  @IsUUID()
  @IsNotEmpty({ message: 'ID пользователя не может быть пустым' })
  userId: string;
}
