import { Controller, Post } from '@nestjs/common';

import { ApiTags } from '@nestjs/swagger';
// import { CreatePaymentDto } from './dto/prodamus.dto';
import { PaymentsService } from './payments.service';

@ApiTags('Payments')
@Controller('payments')
export class PaymentsController {
  constructor(private readonly prodamusService: PaymentsService) {}
}
