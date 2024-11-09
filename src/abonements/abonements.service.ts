import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateAbonementDto } from './dto/createAbonement.dto';
import { EntityManager, LessThan, MoreThan } from 'typeorm';
import { Abonement } from './entities/abonement.entity';
import { UserAbonement } from './entities/userAbonement.entity';
import { buyAbonementDto } from './dto/buyAbonement.dto';
import { User } from 'src/users/entites/user.entity';
import { MainService } from 'src/service/entities/main-service.entity';
import { PaymentsService } from '../payments/payments.service';

@Injectable()
export class AbonementsService {
  constructor(
    private readonly manager: EntityManager,
    private readonly paymentService: PaymentsService
  ) {}

  async create(dto: CreateAbonementDto): Promise<Abonement> {
    // Find the MainService by ID
    const mainService = await this.manager.findOne(MainService, {
      where: { id: dto.abonementType },
    });

    if (!mainService) {
      throw new NotFoundException(
        `MainService with ID ${dto.abonementType} not found`
      );
    }

    // Create and save the Abonement
    const abonement = this.manager.create(Abonement, {
      ...dto,
      abonementType: mainService, // Assign the MainService entity
    });

    return await this.manager.save(abonement);
  }

  async findAll(): Promise<Abonement[]> {
    return this.manager.find(Abonement, { where: { total: MoreThan(1) } });
  }

  async findAllPrizes(): Promise<Abonement[]> {
    return this.manager.find(Abonement, { where: { total: LessThan(2) } });
  }

  async findBy(id: string): Promise<UserAbonement[]> {
    const user = await this.manager.findOne(User, {
      where: { id: id },
      relations: { abonements: { abonement: true } },
    });
    return user.abonements;
  }

  async buy(dto: buyAbonementDto): Promise<UserAbonement> {
    // Находим абонемент
    const abonement = await this.manager.findOne(Abonement, {
      where: { id: dto.abonementId },
    });

    if (!abonement) {
      throw new Error('Abonement not found');
    }

    // Используем withdrawBalance для проверки и списания средств
    await this.paymentService.withdrawBalance(
      dto.userId,
      abonement.price,
      dto.balanceType
    );

    // Находим пользователя с обновлённым балансом
    const user = await this.manager.findOne(User, {
      where: { id: dto.userId },
      relations: ['balance'],
    });

    if (!user) {
      throw new Error('User not found');
    }

    // Создаем объект UserAbonement с правильными связями
    const userAbonement = this.manager.create(UserAbonement, {
      ...dto,
      user: user, // Устанавливаем связь с пользователем
      abonement: abonement, // Устанавливаем связь с абонементом
      remaining: abonement.total, // Устанавливаем начальное количество оставшихся посещений
      expiresAt: this.calculateExpiryDate(), // Добавьте метод для расчета даты истечения
    });

    // Сохраняем все изменения в одной транзакции
    return await this.manager.transaction(
      async (transactionalEntityManager) => {
        await transactionalEntityManager.save(userAbonement);
        return userAbonement;
      }
    );
  }

  private calculateExpiryDate(): Date {
    // Пример: абонемент действителен 30 дней
    const expiryDate = new Date();
    expiryDate.setDate(expiryDate.getDate() + 30);
    return expiryDate;
  }

  async useAbonement(userId: string, abonementId: string): Promise<void> {
    await this.manager.transaction(async (transactionalEntityManager) => {
      // Находим абонемент пользователя
      const userAbonement = await transactionalEntityManager.findOne(
        UserAbonement,
        {
          where: { user: { id: userId }, abonement: { id: abonementId } },
        }
      );

      if (!userAbonement) {
        throw new NotFoundException('UserAbonement not found');
      }

      // Уменьшаем значение remaining на 1
      userAbonement.remaining -= 1;

      if (userAbonement.remaining <= 0) {
        // Если remaining стал 0 или меньше, удаляем абонемент
        await transactionalEntityManager.remove(userAbonement);
      } else {
        // Иначе сохраняем обновленный объект
        await transactionalEntityManager.save(userAbonement);
      }
    });
  }
}
