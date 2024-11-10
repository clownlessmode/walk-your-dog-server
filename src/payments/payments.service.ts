import {
  BadRequestException,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as crypto from 'crypto';
import { Hmac } from './hmac';
import { Payment } from './entities/payment.entity';
import { User } from 'src/users/entites/user.entity';
import { EntityManager } from 'typeorm';
export interface PaymentData {
  order_id: string;
  customer_phone: string;
  customer_email: string;
  demo_mode: number;
  products: {
    name: string;
    price: number;
    quantity: number;
  }[];
  urlReturn: string;
  urlSuccess: string;
  payment_method?: string;
  do: string;
}
@Injectable()
export class PaymentsService {
  private readonly secretKey: string;
  private readonly payformUrl: string;
  logger = new Logger('PaymentsService');
  constructor(
    private configService: ConfigService,
    private manager: EntityManager
  ) {
    this.secretKey = this.configService.getOrThrow<string>(
      'PRODAMUS_SECRET_KEY'
    );
    this.payformUrl = this.configService.getOrThrow<string>(
      'PRODAMUS_PAYFORM_URL'
    );
  }

  private createSignature(data: Record<string, any>): string {
    const sortedData = Object.keys(data)
      .sort()
      .reduce((acc, key) => {
        if (key !== 'signature') {
          acc[key] = data[key];
        }
        return acc;
      }, {});

    const jsonString = JSON.stringify(sortedData);
    return crypto
      .createHmac('sha256', this.secretKey)
      .update(jsonString)
      .digest('hex');
  }

  async createPaymentLink(dto: PaymentData): Promise<string> {
    try {
      const paymentData = {
        ...dto,
        do: 'pay',
      };

      // Remove any undefined values
      const cleanPaymentData = Object.entries(paymentData).reduce(
        (acc, [key, value]) => {
          if (value !== undefined && value !== null) {
            acc[key] = value;
          }
          return acc;
        },
        {}
      );

      const signature = Hmac.create(cleanPaymentData, this.secretKey);

      if (signature === false) {
        throw new Error('Failed to create payment signature');
      }

      // Convert arrays to form-data compatible format
      const formData = this._flattenData(cleanPaymentData);
      formData.signature = signature;

      const params = new URLSearchParams(formData);
      const url = `${this.payformUrl}?${params.toString()}`;

      return url;
    } catch (error) {
      throw error;
    }
  }

  private _flattenData(data: any, prefix = ''): Record<string, string> {
    const result: Record<string, string> = {};

    for (const key in data) {
      const value = data[key];
      const newKey = prefix ? `${prefix}[${key}]` : key;

      if (Array.isArray(value)) {
        value.forEach((item, index) => {
          const arrayKey = `${newKey}[${index}]`;
          if (typeof item === 'object') {
            Object.assign(result, this._flattenData(item, arrayKey));
          } else {
            result[arrayKey] = String(item);
          }
        });
      } else if (typeof value === 'object' && value !== null) {
        Object.assign(result, this._flattenData(value, newKey));
      } else {
        result[newKey] = String(value);
      }
    }

    return result;
  }

  async replenishBalance(userId: string, amount: number) {
    const user = await this.manager.findOne(User, {
      where: { id: userId },
      relations: {
        balance: {
          payments: true,
        },
      },
    });

    if (!user || !user.balance) {
      this.logger.error(`User or balance not found for ID: ${userId}`);
      return;
    }

    // Update the general balance
    user.balance.general += amount;

    // Create a new payment entry
    const payment = new Payment();
    payment.type = 'deposit';
    payment.total = amount;
    payment.balanceId = user.balance;

    await this.manager.transaction(async (transactionalEntityManager) => {
      await transactionalEntityManager.save(user.balance);
      await transactionalEntityManager.save(payment);
    });

    this.logger.log(
      `Баланс для пользователя ID: ${userId} успешно пополнен на ${amount} руб.`
    );
  }

  async withdrawBalance(
    userId: string,
    amount: number,
    balanceType: 'general' | 'promo' = 'general'
  ) {
    const user = await this.manager.findOne(User, {
      where: { id: userId },
      relations: {
        balance: {
          payments: true,
        },
      },
    });

    if (!user || !user.balance) {
      this.logger.error(`Пользователь или баланс не найден для ID: ${userId}`);
      throw new NotFoundException(
        `Пользователь или баланс не найден для ID: ${userId}`
      );
    }
    if (amount === 0) {
      this.logger.log(
        `Запрошено списание 0 руб., операция завершена без изменений баланса для пользователя ID: ${userId}`
      );
      return;
    }

    // Проверка, существует ли указанный тип баланса у пользователя
    const currentBalance = user.balance[balanceType];
    if (currentBalance === undefined) {
      this.logger.error(
        `Баланс типа "${balanceType}" не найден для пользователя ID: ${userId}`
      );
      throw new BadRequestException(
        `Баланс типа "${balanceType}" не найден для пользователя ID: ${userId}`
      );
    }

    // Проверка достаточности средств на выбранном балансе
    if (currentBalance < amount) {
      this.logger.error(
        `Недостаточно средств на балансе типа "${balanceType}" для пользователя ID: ${userId}`
      );
      throw new BadRequestException(
        `Недостаточно средств на балансе типа "${balanceType}" для пользователя ID: ${userId}`
      );
    }

    // Списание суммы с выбранного баланса
    user.balance[balanceType] -= amount;

    // Если используется general баланс, создаем запись о платеже
    if (balanceType === 'general') {
      const payment = new Payment();
      payment.type = 'withdrawal';
      payment.total = amount;
      payment.balanceId = user.balance;

      await this.manager.transaction(async (transactionalEntityManager) => {
        await transactionalEntityManager.save(user.balance);
        await transactionalEntityManager.save(payment);
      });

      this.logger.log(
        `С пользователя ID: ${userId} успешно списано ${amount} руб. с баланса типа "${balanceType}"`
      );
    } else {
      // Сохраняем только баланс, если используется промо-баланс
      await this.manager.save(user.balance);
      this.logger.log(
        `С пользователя ID: ${userId} успешно списано ${amount} руб. с промо-баланса, запись о платеже не создана.`
      );
    }
  }

  async findAllUserPayments(userId: string): Promise<Payment[]> {
    const user = await this.manager.findOne(User, {
      where: { id: userId },
      relations: ['balance', 'balance.payments'],
    });

    if (!user) {
      throw new NotFoundException(`User with ID ${userId} not found`);
    }

    return user.balance?.payments || [];
  }
}
