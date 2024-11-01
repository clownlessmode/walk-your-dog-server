import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsUUID } from 'class-validator';
import { UUID } from 'crypto';

export class CreateBreedDto {
  @ApiProperty({ example: 'e1b2f3d4-5678-9abc-def0-1234567890ab' })
  @IsUUID(4, { message: 'Неправильный формат UUID вида питомца' })
  type: UUID;

  @ApiProperty({ example: 'Китайская хохлатая' })
  @IsString({ message: 'Название породы должно быть строкой' })
  @IsNotEmpty({ message: 'Название породы не может быть пустым' })
  name: string;
}
