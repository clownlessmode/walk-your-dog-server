import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class RefreshDto {
  @ApiProperty({
    example: 'sa78dtas78gds78ag8d7sgayudgsa78dghsa789dhsa789',
    required: true,
  })
  @IsString()
  refreshToken: string;
}
