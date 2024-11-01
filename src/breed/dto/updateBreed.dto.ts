import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString, IsUUID } from 'class-validator';
import { UUID } from 'crypto';

export class UpdateBreedDto {
  @ApiProperty({ example: 'e1b2f3d4-5678-9abc-def0-1234567890ab' })
  @IsUUID(4, { message: 'Неправильный формат UUID вида питомца' })
  @IsOptional()
  type?: UUID;

  @ApiProperty({ example: 'Китайская хохлатая' })
  @IsString({ message: 'Название породы должно быть строкой' })
  @IsOptional()
  name?: string;
}
