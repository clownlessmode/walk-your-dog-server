import { Injectable, NotFoundException } from '@nestjs/common';
import { EntityManager, In } from 'typeorm';
import { Vaccine } from './entities/vaccine.entity';
import { CreateVaccineDto } from './dto/createVaccine.dto';
import { UpdateVaccineDto } from './dto/updateVaccine.dto';

@Injectable()
export class VaccinesService {
  constructor(private readonly manager: EntityManager) {}

  async create(dto: CreateVaccineDto): Promise<Vaccine> {
    const vaccine = this.manager.create(Vaccine, dto);
    return await this.manager.save(vaccine);
  }

  async findAll(): Promise<Vaccine[]> {
    return this.manager.find(Vaccine);
  }

  async findOne(id: string): Promise<Vaccine> {
    try {
      return await this.manager.findOneOrFail(Vaccine, {
        where: { id: id },
      });
    } catch (error) {
      throw new NotFoundException(`Вакцина с ID ${id} не найдена`);
    }
  }

  async findMany(ids: string[]): Promise<Vaccine[]> {
    const vaccines = await this.manager.findBy(Vaccine, {
      id: In(ids),
    });
    if (vaccines.length !== ids.length) {
      throw new NotFoundException('Не все запрашиваемые вакцины найдены');
    }
    return vaccines;
  }

  async update(id: string, dto: UpdateVaccineDto): Promise<Vaccine> {
    const vaccine = await this.findOne(id);
    Object.assign(vaccine, dto);
    return await this.manager.save(vaccine);
  }

  async delete(id: string): Promise<void> {
    await this.manager.delete(Vaccine, {
      id: id,
    });
  }
}
