import { Injectable } from '@nestjs/common';
import {} from '@nestjs/typeorm';
import { ServiceValue } from './entities/service-value.entity';
import { Additional } from './entities/additional.entity';
import { EntityManager } from 'typeorm';
import { CreateServiceValueDto } from './dto/createServiceValue.dto';
import { CreateAdditionalDto } from './dto/createAdditional.dto';

@Injectable()
export class ServiceService {
  constructor(private manager: EntityManager) {}

  async create(dto: CreateServiceValueDto): Promise<ServiceValue> {
    const serviceValue = this.manager.create(ServiceValue, {
      ...dto,
      additional: dto.additional,
    });
    return await this.manager.save(serviceValue);
  }

  async addAdditional(
    serviceId: string,
    additionalDto: CreateAdditionalDto
  ): Promise<ServiceValue> {
    const serviceValue = await this.manager.findOne(ServiceValue, {
      where: { id: serviceId },
    });
    const additional = this.manager.create(Additional, {
      ...additionalDto,
      serviceValue,
    });
    serviceValue.additional.push(additional);
    await this.manager.save(additional);
    return serviceValue;
  }

  async removeAdditional(
    serviceId: string,
    additionalId: string
  ): Promise<ServiceValue> {
    await this.manager.delete(Additional, {
      id: additionalId,
      serviceValue: { id: serviceId },
    });
    return await this.manager.findOne(ServiceValue, {
      where: { id: serviceId },
      relations: ['additional'],
    });
  }

  async deleteServiceValue(serviceId: string): Promise<void> {
    await this.manager.delete(ServiceValue, serviceId);
  }

  async findAll(): Promise<ServiceValue[]> {
    return await this.manager.find(ServiceValue);
  }
}
