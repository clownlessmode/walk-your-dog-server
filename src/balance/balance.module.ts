import { Module } from '@nestjs/common';
import { BalanceService } from './balance.service';
import { BalanceController } from './balance.controller';
import { PaymentsModule } from 'src/payments/payments.module';

@Module({
  controllers: [BalanceController],
  providers: [BalanceService],
  imports: [PaymentsModule],
})
export class BalanceModule {}
