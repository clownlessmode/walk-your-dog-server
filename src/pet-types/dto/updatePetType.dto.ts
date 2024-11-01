import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class UpdatePetTypeDto {
  @ApiProperty({ example: 'Собака' })
  @IsString({ message: 'Название вида питомца должно быть строкой' })
  @IsNotEmpty({ message: 'Вид питомца не может быть пустым' })
  type: string;
}
