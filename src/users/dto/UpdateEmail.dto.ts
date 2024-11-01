import { ApiProperty } from '@nestjs/swagger';
import { IsPhoneNumber, IsString } from 'class-validator';

export class UpdateTelephoneDto {
  @ApiProperty({
    example: '+71234567890',
    required: true,
  })
  @IsPhoneNumber('RU')
  telephone: string;
  @ApiProperty({
    example: '4532',
    required: true,
  })
  @IsString()
  code: string;
}
