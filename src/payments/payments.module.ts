import { Module } from '@nestjs/common';
import { PaymentsService } from './payments.service';
import { PaymentsController } from './payments.controller';
import { ProdamusWebhookController } from './payment-webhook.controller';

@Module({
  controllers: [PaymentsController, ProdamusWebhookController],
  providers: [PaymentsService],
  exports: [PaymentsService],
})
export class PaymentsModule {}
