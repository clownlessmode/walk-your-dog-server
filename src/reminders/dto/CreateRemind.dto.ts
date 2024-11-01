import { ApiProperty } from '@nestjs/swagger';
import {
  IsArray,
  IsDateString,
  IsEnum,
  IsNumber,
  IsUUID,
  ArrayMinSize,
  IsOptional,
} from 'class-validator';
import { reminderType } from '../enums/reminderType.enum';
import { Transform } from 'class-transformer';
import { UUID } from 'crypto';

export class CreateRemindDto {
  @ApiProperty({ example: 'e1b2f3d4-5678-9abc-def0-1234567890ab' })
  @IsUUID()
  user: UUID;

  @ApiProperty({ example: '2024-09-21T12:34:56.789Z' })
  @IsDateString()
  datetime: Date;

  @ApiProperty({ example: 'SUBSCRIBE' })
  @IsEnum(reminderType)
  reminderType: reminderType;

  @ApiProperty({
    example: [
      'e1b2f3d4-5678-9abc-def0-1234567890ab',
      'e1b2f3d4-5678-9abc-def0-1234567890ab',
    ],
  })
  @Transform(({ value }) => {
    if (typeof value === 'string') {
      const uuids = value.split(',').map((item) => item.trim());
      return uuids;
    }
    return value;
  })
  @IsArray()
  @IsUUID('4', { each: true })
  pet: string[];

  @ApiProperty({ example: 3 })
  @IsNumber()
  remind: number;

  @ApiProperty({
    description:
      'Дни недели для повтора напоминания (1 - понедельник, ..., 7 - воскресенье)',
    example: [1, 3, 5],
    required: false,
  })
  @IsArray()
  @IsOptional()
  @ArrayMinSize(0)
  repeatDays?: number[];
}
