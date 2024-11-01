import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty, IsUUID } from 'class-validator';

export class buyAbonementDto {
  @ApiProperty({ example: 'e1b2f3d4-5678-9abc-def0-1234567890ab' })
  @IsUUID(4, { message: 'Неправильный формат UUID для пользователя' })
  @IsNotEmpty({ message: 'ID пользователя не может быть пустым' })
  userId: string;

  @ApiProperty({ example: 'e1b2f3d4-5678-9abc-def0-1234567890ab' })
  @IsUUID(4, { message: 'Неправильный формат UUID для абонемента' })
  @IsNotEmpty({ message: 'ID абонемента не может быть пустым' })
  abonementId: string;

  @ApiProperty({ example: 'promo', enum: ['promo', 'general'] })
  @IsEnum(['promo', 'general'], {
    message: 'Тип баланса должен быть "promo" или "general"',
  })
  balanceType: 'promo' | 'general';
}
