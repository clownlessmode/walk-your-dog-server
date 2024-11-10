import { Body, Controller, Headers, Post, Res, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Response } from 'express';
import { Hmac } from './hmac';
import { ApiTags } from '@nestjs/swagger';
import { PaymentsService } from './payments.service';
import { EntityManager } from 'typeorm';
import { AbonementsService } from 'src/abonements/abonements.service';
import { Abonement } from 'src/abonements/entities/abonement.entity';

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
    private readonly manager: EntityManager,
    private readonly configService: ConfigService,
    private readonly paymentService: PaymentsService,
    private readonly abonementService: AbonementsService
  ) {}
  logger = new Logger('Web-hooks');

  @Post()
  async handleWebhook(
    @Headers('sign') signature: string,
    @Body() payload: WebhookPayload,
    @Res() res: Response
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

    // Extract prize parameter if present
    const prizeMatch = order_num.match(/&prize=([a-f0-9-]{36}|undefined|null)/);
    const prize =
      prizeMatch && prizeMatch[1] !== 'undefined' && prizeMatch[1] !== 'null'
        ? prizeMatch[1]
        : null;

    if (userId) {
      this.logger.log(
        `Prefix: ${prefix}, Action: ${action}, User ID: ${userId}, Prize: ${prize}`
      );

      switch (`${prefix}-${action}`) {
        case 'wyd-replenishment':
          if (Number(payload.attempt) != 1) {
            break;
          }
          await this.paymentService.replenishBalance(
            userId,
            Number(payload.sum)
          );

          let aprize = undefined;
          if (prize) {
            aprize = await this.manager.findOne(Abonement, {
              where: { id: prize },
            });
          }

          console.log('APRIZE: ', aprize);
          if (aprize && Number(payload.sum) >= 3000) {
            console.log('ДАБАВЛЯЮ');
            const priaze = await this.abonementService.buy({
              abonementId: prize,
              balanceType: 'promo',
              userId: userId,
            });
            console.log('ДАБАВИЛД', priaze);
          }
          break;
        case 'wyd-withdrawal':
          console.log(`В ЫПОЛНИ ВЫВОД id: ${userId}`);
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
