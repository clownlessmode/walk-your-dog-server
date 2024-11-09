// payments.module.ts
import { Module, forwardRef } from '@nestjs/common';
import { PaymentsService } from './payments.service';
import { PaymentsController } from './payments.controller';
import { ProdamusWebhookController } from './payment-webhook.controller';
import { AbonementsModule } from 'src/abonements/abonements.module';

@Module({
  controllers: [PaymentsController, ProdamusWebhookController],
  providers: [PaymentsService],
  exports: [PaymentsService],
  imports: [forwardRef(() => AbonementsModule)], // Используем forwardRef здесь
})
export class PaymentsModule {}
