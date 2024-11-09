import { Injectable } from '@nestjs/common';
import { EntityManager } from 'typeorm';
import { AddBalanceDto } from './dto/add-balance.dto';
import { User } from 'src/users/entites/user.entity';
import { PaymentData, PaymentsService } from 'src/payments/payments.service';

@Injectable()
export class BalanceService {
  constructor(
    private readonly manager: EntityManager,
    private paymentService: PaymentsService
  ) {}

  async addBalance(id: string, dto: AddBalanceDto): Promise<string> {
    const user = await this.manager.findOneOrFail(User, {
      where: {
        id,
      },
      relations: {
        meta: true,
        balance: {
          payments: true,
        },
      },
    });

    const payment: PaymentData = {
      order_id: `wyd-replenishment-${user.id}-${new Date().toISOString()}&prize=${dto.prize}`,
      customer_email: user.meta.email,
      customer_phone: user.meta.telephone,
      demo_mode: 1,
      payment_method: 'AC',
      products: [
        {
          name: `Пополнение баланса пользователя: ${user.meta.name}`,
          price: dto.amount,
          quantity: 1,
        },
      ],
      urlReturn: 'https://yourdomain.com/return',
      urlSuccess: 'https://yourdomain.com/success',
      do: 'pay',
    };

    return this.paymentService.createPaymentLink(payment);
  }
}
