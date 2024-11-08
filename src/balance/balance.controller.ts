import { Body, Controller, Logger, Param, Post } from '@nestjs/common';
import { BalanceService } from './balance.service';
import { ApiOperation, ApiProperty, ApiTags } from '@nestjs/swagger';
import { IsNumber } from 'class-validator';
import { Balance } from './entities/balance.entity';
import { Payment } from 'src/payments/entities/payment.entity';
import { AddBalanceDto } from './dto/add-balance.dto';

class BalanceDto {
  @ApiProperty({ example: 1900 })
  @IsNumber()
  amount: number;
}

@ApiTags('Balance')
@Controller('balance')
export class BalanceController {
  constructor(private readonly balanceService: BalanceService) {}

  logger = new Logger();

  @Post(':id')
  @ApiOperation({ summary: 'Пополнить баланс пользователя по его id' })
  async addBalance(
    @Param('id') id: string,
    @Body() dto: AddBalanceDto
  ): Promise<string> {
    const link = await this.balanceService.addBalance(id, dto);
    this.logger.debug(
      `Сделан запрос на пополнение баланса: ${id}, ${dto.amount}`
    );
    return link;
  }
}
