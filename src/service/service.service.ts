import { Injectable } from '@nestjs/common';
import {} from '@nestjs/typeorm';

import { EntityManager } from 'typeorm';
import { CreateMainServiceDto } from './dto/create-main.dto';
import { MainService } from './entities/main-service.entity';
import { SubService } from './entities/sub-service.entity';
import { CreateSubServiceDto } from './dto/create-sub.dto';

@Injectable()
export class ServiceService {
  constructor(private manager: EntityManager) {}
  // All Services
  async getCatalog(): Promise<any> {
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
}
