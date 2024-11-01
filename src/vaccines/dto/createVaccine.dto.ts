import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class CreateVaccineDto {
  @ApiProperty({ example: '«Канивак CH» (чума + гепатит)' })
  @IsString({ message: 'Название вакцины должно быть строкой' })
  @IsNotEmpty({ message: 'Название вакцины не может быть пустым' })
  name: string;
}
