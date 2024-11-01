import { IsPhoneNumber, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class verifyCodeDto {
  @ApiProperty({
    example: '+71234567890',
    required: true,
  })
  @IsPhoneNumber('RU')
  telephone: string;
  @ApiProperty({
    example: '+71234567890',
    required: true,
  })
  @IsString()
  code: string;
}
