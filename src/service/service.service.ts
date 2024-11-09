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

@Injectable()
export class ServiceService {
  constructor(
    private manager: EntityManager,
    private paymentService: PaymentsService
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
    // Проверка существования mainService
    const mainService = await this.manager.findOne(MainService, {
      where: { id: dto.mainServiceId },
    });
    if (!mainService) {
      throw new NotFoundException(
        `MainService with ID ${dto.mainServiceId} not found`
      );
    }
    // Проверка существования customer
    const customer = await this.manager.findOne(User, {
      where: { id: dto.customerId },
    });
    if (!customer) {
      throw new NotFoundException(
        `Customer with ID ${dto.customerId} not found`
      );
    }

    // Проверка существования pet
    const pet = await this.manager.findOne(Pet, { where: { id: dto.petId } });
    if (!pet) {
      throw new NotFoundException(`Pet with ID ${dto.petId} not found`);
    }

    // Проверка существования address
    const address = await this.manager.findOne(Address, {
      where: { id: dto.addressId },
    });
    if (!address) {
      throw new NotFoundException(`Address with ID ${dto.addressId} not found`);
    }

    // Проверка существования всех subServices и расчет общей стоимости
    const subServices = await Promise.all(
      dto.subServiceIds.map(async (subServiceId) => {
        const subService = await this.manager.findOne(SubService, {
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

    const totalPrice =
      Number(mainService.price) +
      subServices.reduce((sum, sub) => sum + Number(sub.price), 0);
    // Списание суммы с баланса заказчика
    await this.paymentService.withdrawBalance(
      dto.customerId,
      totalPrice,
      dto.balanceType
    );

    // Создание и сохранение новой записи Service
    const service = this.manager.create(Service, {
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

    return await this.manager.save(service);
  }

  async getByCustomer(id: string): Promise<Service[]> {
    return await this.manager.find(Service, {
      where: { customer: { id: id } },
      relations: ['mainService', 'worker', 'pet', 'subServices', 'address'],
    });
  }
}
