import { Controller, Get, Logger, Param } from '@nestjs/common';

import { ApiOperation, ApiTags } from '@nestjs/swagger';
// import { CreatePaymentDto } from './dto/prodamus.dto';
import { PaymentsService } from './payments.service';
import { Payment } from './entities/payment.entity';

@ApiTags('Payments')
@Controller('payments')
export class PaymentsController {
  constructor(private readonly paymentsService: PaymentsService) {}
  private readonly logger = new Logger(PaymentsController.name);

  @Get('user/:id')
  @ApiOperation({ summary: 'Retrieve all payments for a specific user by ID' })
  async findAllUserPayments(@Param('id') userId: string): Promise<Payment[]> {
    const payments = await this.paymentsService.findAllUserPayments(userId);
    this.logger.debug(`User with ID ${userId} has ${payments.length} payments`);
    return payments;
  }
}
