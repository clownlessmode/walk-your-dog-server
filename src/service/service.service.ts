import { Injectable } from '@nestjs/common';
import { InjectEntityManager } from '@nestjs/typeorm';
import { EntityManager } from 'typeorm';
import { Service } from './entities/service.entity';

@Injectable()
export class ServiceService {
  constructor(
    @InjectEntityManager()
    private readonly manager: EntityManager
  ) {}
  /*
 // Метод для поиска услуг с определенными условиями
 async findServices(whereConditions: Partial<Service>): Promise<Service[]> {
   return this.manager.find(Service, { where: whereConditions });
 }
*/

  // Метод для создания новой услуги
  async createService(data: Partial<Service>): Promise<Service> {
    const service = this.manager.create(Service, data);
    return this.manager.save(service);
  }

  /*
// Метод для обновления услуги
async updateService(id: number, data: Partial<Service>): Promise<Service> {
 await this.manager.update(Service, id, data);
 return this.manager.findOne(Service, { where: { id } });
}
*/
  /*
// Метод для удаления услуги
async deleteService(id: number): Promise<void> {
 await this.manager.delete(Service, id);
}*/
}
