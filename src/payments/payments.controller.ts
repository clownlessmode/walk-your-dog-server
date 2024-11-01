import { Controller, Post } from '@nestjs/common';

import { ApiTags } from '@nestjs/swagger';
// import { CreatePaymentDto } from './dto/prodamus.dto';
import { PaymentsService } from './payments.service';
@ApiTags('Payments')
@Controller('payments')
export class PaymentsController {
  constructor(private readonly prodamusService: PaymentsService) {}

  @Post('create-link')
  async createPaymentLink() // @Body() createPaymentDto: CreatePaymentDto
  : Promise<{ paymentUrl: string }> {
    // const paymentUrl =
    // await this.prodamusService.createPaymentLink(createPaymentDto);

    const paymentData = {
      order_id: '123344',
      customer_phone: '+79001234567',
      customer_email: 'test@test.com',
      products: [
        {
          name: 'Test',
          price: 100,
          quantity: 1,
        },
      ],
      urlReturn: 'https://test.com/return',
      urlSuccess: 'https://test.com/success',
      do: 'pay',
    };

    const paymentUrl =
      await this.prodamusService.createPaymentLink(paymentData);
    return { paymentUrl };
  }
}
