import { Module } from '@nestjs/common';
import { ServiceService } from './service.service';
import { ServiceController } from './service.controller';
import { PaymentsModule } from 'src/payments/payments.module';
import { AbonementsModule } from 'src/abonements/abonements.module';

@Module({
  imports: [PaymentsModule, AbonementsModule],
  controllers: [ServiceController],
  providers: [ServiceService],
})
export class ServiceModule {}
