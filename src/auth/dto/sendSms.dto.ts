import { IsPhoneNumber } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class SendSmsDto {
  @ApiProperty({
    example: '+71234567890',
    required: true,
  })
  @IsPhoneNumber('RU')
  telephone: string;
}
