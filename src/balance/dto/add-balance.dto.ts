import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNumber, IsOptional, IsUUID } from 'class-validator';

export class AddBalanceDto {
  @IsNumber()
  @ApiProperty({ example: 1234 })
  amount: number;
  @IsOptional()
  @IsUUID()
  @ApiPropertyOptional({
    type: String,
    example: 'f47ac10b-58cc-4372-a567-0e02b2c3d479',
    nullable: true,
  })
  prize: string | null;
}
