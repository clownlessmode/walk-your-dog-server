import {
  Body,
  Controller,
  Headers,
  Post,
  Res,
  Req,
  Logger,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Response, Request } from 'express';
import { Hmac } from './hmac';
import { ApiTags } from '@nestjs/swagger';
import { EntityManager } from 'typeorm';
import { PaymentsService } from './payments.service';

interface Product {
  name: string;
  price: string;
  quantity: string;
  sum: string;
}

interface WebhookPayload {
  date: string;
  order_id: string;
  order_num: string;
  domain: string;
  sum: string;
  customer_phone: string;
  customer_email: string;
  customer_extra: string;
  payment_type: string;
  commission: string;
  commission_sum: string;
  attempt: string;
  sys: string;
  products: Product[];
  payment_status: string;
  payment_status_description: string;
}

@ApiTags('WEBHOOK')
@Controller('prodamus-webhook')
export class ProdamusWebhookController {
  constructor(
    private readonly configService: ConfigService,
    private readonly paymentService: PaymentsService
  ) {}
  logger = new Logger('Web-hooks');

  @Post()
  async handleWebhook(
    @Headers('sign') signature: string,
    @Body() payload: WebhookPayload,
    @Res() res: Response,
    @Req() req: Request
  ) {
    const secretKey = this.configService.get<string>('PRODAMUS_SECRET_KEY');
    const isSignatureValid = Hmac.verify(payload, secretKey, signature);

    if (!isSignatureValid) {
      res.status(400).send('Invalid signature');
      return;
    }

    try {
      await this.processWebhook(payload);
      res.status(200).send('Webhook processed successfully');
    } catch (error) {
      res.status(500).send('Failed to process webhook');
    }
  }

  async processWebhook(payload: WebhookPayload) {
    console.log('Received webhook:', payload);

    const { order_num } = payload;

    const prefix = order_num.split('-')[0];
    const action = order_num.split('-')[1];
    const userIdWithTimestamp = order_num.substring(
      prefix.length + action.length + 2
    );

    const userIdMatch = userIdWithTimestamp.match(/^[a-f0-9-]{36}/);
    const userId = userIdMatch ? userIdMatch[0] : null;

    if (userId) {
      this.logger.log(
        `Prefix: ${prefix}, Action: ${action}, User ID: ${userId}`
      );

      switch (`${prefix}-${action}`) {
        case 'wyd-replenishment':
          await this.paymentService.replenishBalance(
            userId,
            Number(payload.sum)
          );
          break;
        case 'wyd-withdrawal':
          console.log(`ВЫПОЛНИ ВЫВОД id: ${userId}`);
          break;

        default:
          console.log('Unknown order type in webhook');
          break;
      }
    } else {
      console.log('Invalid user ID format in order_num');
    }
  }
}
