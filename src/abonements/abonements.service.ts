import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateAbonementDto } from './dto/createAbonement.dto';
import { EntityManager } from 'typeorm';
import { Abonement } from './entities/abonement.entity';
import { UserAbonement } from './entities/userAbonement.entity';
import { buyAbonementDto } from './dto/buyAbonement.dto';
import { User } from 'src/users/entites/user.entity';
import { MainService } from 'src/service/entities/main-service.entity';

@Injectable()
export class AbonementsService {
  constructor(private readonly manager: EntityManager) {}

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
    return this.manager.find(Abonement);
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

    // Находим пользователя
    const user = await this.manager.findOne(User, {
      where: { id: dto.userId },
      relations: ['balance'],
    });

    if (!user) {
      throw new Error('User not found');
    }

    if (!user.balance) {
      throw new Error('User balance not found');
    }

    // Проверяем и списываем средства
    if (dto.balanceType === 'promo' && user.balance.promo >= abonement.price) {
      user.balance.promo -= abonement.price;
    } else if (
      dto.balanceType === 'general' &&
      user.balance.general >= abonement.price
    ) {
      user.balance.general -= abonement.price;
    } else {
      throw new Error('Insufficient funds or incorrect balance type');
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
        await transactionalEntityManager.save(user.balance);
        await transactionalEntityManager.save(user);
        return await transactionalEntityManager.save(userAbonement);
      }
    );
  }

  private calculateExpiryDate(): Date {
    // Пример: абонемент действителен 30 дней
    const expiryDate = new Date();
    expiryDate.setDate(expiryDate.getDate() + 30);
    return expiryDate;
  }
}
