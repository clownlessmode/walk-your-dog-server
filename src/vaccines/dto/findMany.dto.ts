import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsUUID } from 'class-validator';

export class FindManyVaccinesDto {
  @ApiProperty({
    example: ['e1b2f3d4-5678-9abc-def0-1234567890ab'],
  })
  @IsArray({ message: 'Поле должно быть массивом вакцин' })
  @IsUUID('4', {
    each: true,
    message: 'Каждая вакцина должна быть в формате UUID',
  })
  vaccine: string[];
}
