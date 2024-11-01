import { ApiProperty } from '@nestjs/swagger';
import {
  IsArray,
  IsBoolean,
  IsDateString,
  IsEnum,
  IsOptional,
  IsString,
  IsUUID,
} from 'class-validator';
import { gender } from '../enums/gender.enum';
import { UUID } from 'crypto';
import { Transform } from 'class-transformer';

export class CreatePetDto {
  @ApiProperty({
    type: 'string',
    format: 'binary',
    description: 'Изображение для загрузки',
    required: false,
  })
  @IsOptional()
  image: any;

  @ApiProperty({ example: 'Томас' })
  @IsUUID()
  owner: UUID;

  @ApiProperty({ example: 'Томас' })
  @IsString()
  name: string;

  @ApiProperty({ example: 'e1b2f3d4-5678-9abc-def0-1234567890ab' })
  @IsUUID()
  breed: string;

  @ApiProperty({ example: '2024-09-21T12:34:56.789Z' })
  @IsDateString()
  birthdate: Date;

  @ApiProperty({ example: 'MALE' })
  @IsEnum(gender)
  gender: gender;

  @ApiProperty({
    example: true,
  })
  @IsBoolean()
  @Transform(({ value }) => value === 'true' || value === true) // Преобразование строк в булевое значение
  sterilized: boolean;

  @ApiProperty({
    example: true,
  })
  @IsBoolean()
  @Transform(({ value }) => value === 'true' || value === true) // Преобразование строк в булевое значение
  aggressive: boolean;

  @ApiProperty({
    example: false,
  })
  @IsBoolean()
  @Transform(({ value }) => value === 'true' || value === true) // Преобразование строк в булевое значение
  pulls: boolean;

  @ApiProperty({
    example: 'Общее состояние хорошее',
  })
  @IsString()
  health: string;

  @ApiProperty({
    example: 'Есть грыжа на пятке',
  })
  @IsString()
  additional: string;

  @ApiProperty({
    type: [String], // Указываем массив строк
    example: [
      'ac693daa-15bd-4e61-987f-5a529802ccea',
      'ecf6a0ae-5e06-42d5-bc04-ea72ec3ebf47',
    ],
  })
  @Transform(({ value }) => {
    if (typeof value === 'string') {
      // Разделяем строку по запятой и убираем лишние пробелы
      const uuids = value.split(',').map((item) => item.trim());
      return uuids;
    }
    return value;
  })
  @IsArray()
  @IsUUID('4', { each: true })
  vaccine: string[];
}
