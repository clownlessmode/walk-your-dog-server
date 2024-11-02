import { Injectable, NotFoundException } from '@nestjs/common';
import { EntityManager } from 'typeorm';
import { Balance } from './entities/balance.entity';

@Injectable()
export class BalanceService {
  constructor(private readonly manager: EntityManager) {}

  async addBalance(id: string, amount: number): Promise<Balance> {
    const balance = await this.manager.findOne(Balance, { where: { id: id } });
    if (!balance) throw new NotFoundException('Balance not found');

    balance.general += amount;
    return this.manager.save(balance);
  }
}
