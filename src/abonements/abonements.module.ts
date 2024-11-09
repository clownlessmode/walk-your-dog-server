// abonements.module.ts
import { Module, forwardRef } from '@nestjs/common';
import { AbonementsService } from './abonements.service';
import { AbonementsController } from './abonements.controller';
import { PaymentsModule } from 'src/payments/payments.module';

@Module({
  controllers: [AbonementsController],
  providers: [AbonementsService],
  exports: [AbonementsService],
  imports: [forwardRef(() => PaymentsModule)], // И здесь forwardRef
})
export class AbonementsModule {}
