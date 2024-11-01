import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsUUID } from 'class-validator';
import { UUID } from 'crypto';

export class CreateAddressDto {
  @ApiProperty({ example: 'г. Москва, ул. Пушкина, д. 12' })
  @IsString({ message: 'Адрес должен быть строкой' })
  @IsNotEmpty({ message: 'Адрес не может быть пустым' })
  address: string;

  @ApiProperty({ example: 55.75396 })
  @IsNotEmpty({ message: 'Широта не может быть пустой' })
  lat: number;

  @ApiProperty({ example: 37.62037 })
  @IsNotEmpty({ message: 'Долгота не может быть пустой' })
  lon: number;

  @ApiProperty({ example: '&*(SDYA&*(FWEDYS&*(RFYW$(*YUR*)FG$U@#*()U' })
  @IsUUID()
  userId: UUID;
}
