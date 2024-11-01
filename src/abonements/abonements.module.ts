import { Module } from '@nestjs/common';
import { AbonementsService } from './abonements.service';
import { AbonementsController } from './abonements.controller';

@Module({
  controllers: [AbonementsController],
  providers: [AbonementsService],
})
export class AbonementsModule {}
