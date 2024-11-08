import { ApiProperty } from '@nestjs/swagger';
import { IsNumber } from 'class-validator';

export class AddBalanceDto {
  @IsNumber()
  @ApiProperty({ example: 1234 })
  amount: number;
}
