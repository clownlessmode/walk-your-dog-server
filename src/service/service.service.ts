import { Injectable, NotFoundException } from '@nestjs/common';
import {} from '@nestjs/typeorm';

import { EntityManager } from 'typeorm';
import { CreateMainServiceDto } from './dto/create-main.dto';
import { MainService } from './entities/main-service.entity';
import { SubService } from './entities/sub-service.entity';
import { CreateSubServiceDto } from './dto/create-sub.dto';
import { Service, Status } from './entities/service.entity';
import { CreateServiceDto } from './dto/create-service.dto';
import { Address } from 'src/adresses/entities/address.entity';
import { Pet } from 'src/pets/entities/pet.entity';
import { User } from 'src/users/entites/user.entity';
import { PaymentsService } from 'src/payments/payments.service';
import { AbonementsService } from 'src/abonements/abonements.service';

@Injectable()
export class ServiceService {
  constructor(
    private manager: EntityManager,
    private paymentService: PaymentsService,
    private abonementService: AbonementsService
  ) {}
  // All Services
  async getCatalog(): Promise<
    {
      additional: any;
      name: string;
      price: number;
      id: string;
      created_at: string;
      updated_at: string;
    }[]
  > {
    const mainServices = await this.manager.find(MainService);
    const subServices = await this.manager.find(SubService);

    const subServicesGrouped = subServices.reduce((acc, subService) => {
      const { main_id } = subService;
      if (!acc[main_id]) {
        acc[main_id] = [];
      }
      acc[main_id].push(subService);
      return acc;
    }, {});

    const result = mainServices.map((mainService) => {
      return {
        ...mainService,
        additional: subServicesGrouped[mainService.id] || [],
      };
    });

    return result;
  }

  async getAllUserServices(customerId: string): Promise<Service[]> {
    return await this.manager.find(Service, {
      where: {
        customer: {
          id: customerId,
        },
      },
      relations: {
        address: true,
        customer: {
          meta: true,
        },
        subServices: true,
        mainService: true,
      },
    });
  }

  // Main Services
  async createMain(dto: CreateMainServiceDto): Promise<MainService> {
    const service = await this.manager.create(MainService, dto);
    return await this.manager.save(service);
  }

  // Sub Services
  async createSub(dto: CreateSubServiceDto): Promise<SubService> {
    const service = await this.manager.create(SubService, dto);
    return await this.manager.save(service);
  }

  // Real Services
  async createService(dto: CreateServiceDto): Promise<Service> {
    return await this.manager.transaction(async (transactionManager) => {
      const mainService = await transactionManager.findOne(MainService, {
        where: { id: dto.mainServiceId },
      });
      if (!mainService) {
        throw new NotFoundException(
          `MainService with ID ${dto.mainServiceId} not found`
        );
      }

      const customer = await transactionManager.findOne(User, {
        where: { id: dto.customerId },
        relations: {
          abonements: {
            abonement: {
              abonementType: true,
            },
          },
        },
      });

      if (!customer) {
        throw new NotFoundException(
          `Customer with ID ${dto.customerId} not found`
        );
      }

      const pet = await transactionManager.findOne(Pet, {
        where: { id: dto.petId },
      });
      if (!pet) {
        throw new NotFoundException(`Pet with ID ${dto.petId} not found`);
      }

      const address = await transactionManager.findOne(Address, {
        where: { id: dto.addressId },
      });
      if (!address) {
        throw new NotFoundException(
          `Address with ID ${dto.addressId} not found`
        );
      }

      const subServices = await Promise.all(
        dto.subServiceIds.map(async (subServiceId) => {
          const subService = await transactionManager.findOne(SubService, {
            where: { id: subServiceId },
          });
          if (!subService) {
            throw new NotFoundException(
              `SubService with ID ${subServiceId} not found`
            );
          }
          return subService;
        })
      );

      let totalPrice =
        Number(mainService.price) +
        subServices.reduce((sum, sub) => sum + Number(sub.price), 0);

      // Ищем подходящие абонементы
      const matchingAbonements = customer.abonements.filter((userAbonement) => {
        const matches =
          userAbonement.abonement.abonementType.id === dto.mainServiceId &&
          userAbonement.remaining > 0;

        return matches;
      });

      // Сортировка абонементов:
      // 1. Приоритет разовым абонементам (total=1)
      // 2. Среди разовых - тем, у которых remaining=1
      // 3. Среди остальных - по remaining по возрастанию
      const sortedAbonements = [...matchingAbonements].sort((a, b) => {
        const aIsOneTime = a.abonement.total === 1;
        const bIsOneTime = b.abonement.total === 1;
        const aIsUnusedOneTime = aIsOneTime && a.remaining === 1;
        const bIsUnusedOneTime = bIsOneTime && b.remaining === 1;

        // Сначала проверяем на разовые неиспользованные абонементы
        if (aIsUnusedOneTime && !bIsUnusedOneTime) return -1;
        if (!aIsUnusedOneTime && bIsUnusedOneTime) return 1;

        // Затем проверяем просто на разовые
        if (aIsOneTime && !bIsOneTime) return -1;
        if (!aIsOneTime && bIsOneTime) return 1;

        // Если оба разовые или оба не разовые, сортируем по remaining
        return a.remaining - b.remaining;
      });

      const availableAbonement = sortedAbonements[0];

      if (availableAbonement) {
        totalPrice -= Number(mainService.price);

        await this.abonementService.useAbonement(
          customer.id,
          availableAbonement.abonement.id
        );
      }

      if (totalPrice > 0) {
        await this.paymentService.withdrawBalance(
          dto.customerId,
          totalPrice,
          dto.balanceType
        );
      }

      const service = transactionManager.create(Service, {
        mainService,
        customer,
        pet,
        address,
        subServices,
        isPayed: true,
        datetime: dto.datetime,
        status: Status.IN_PROGRESS,
        comment: dto.comment,
        price: totalPrice,
      });

      const savedService = await transactionManager.save(service);

      return savedService;
    });
  }

  async getByCustomer(id: string): Promise<Service[]> {
    return await this.manager.find(Service, {
      where: {
        customer: {
          id: id,
        },
      },
      relations: {
        address: true,
        customer: {
          meta: true,
        },
        subServices: true,
        mainService: true,
      },
    });
  }
}
