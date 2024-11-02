import { Body, Controller, Param, Post } from '@nestjs/common';
import { BalanceService } from './balance.service';
import { ApiOperation, ApiProperty, ApiTags } from '@nestjs/swagger';
import { IsNumber } from 'class-validator';

class BalanceDto {
  @ApiProperty({ example: 1900 })
  @IsNumber()
  amount: number;
}


@ApiTags('Balance')
@Controller('balance')
export class BalanceController {
  constructor(private readonly balanceService: BalanceService) {}




  @ApiOperation({ summary: 'Set balance' })
  @Post(':id')
  async set(@Param('id') id: string, @Body() amount: BalanceDto) {
    return await this.balanceService.addBalance(id, amount.amount);
  }
}
