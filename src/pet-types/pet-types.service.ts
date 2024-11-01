import { UpdatePetTypeDto } from './dto/updatePetType.dto';
import { Injectable, NotFoundException } from '@nestjs/common';
import { EntityManager } from 'typeorm';
// WTF?? What's wrong with this?
import { PetType } from './entities/pet-type.entity';
import { createpettypedto } from './dto/createpettype.dto';

@Injectable()
export class PetTypesService {
  constructor(private readonly manager: EntityManager) {}

  async create(dto: createpettypedto): Promise<PetType> {
    const petType = this.manager.create(PetType, dto);
    return await this.manager.save(petType);
  }

  async findAll(): Promise<PetType[]> {
    return this.manager.find(PetType);
  }

  async findOne(id: string): Promise<PetType> {
    try {
      return await this.manager.findOneOrFail(PetType, {
        where: { id: id },
      });
    } catch (error) {
      throw new NotFoundException(`Вид питомца с ID ${id} не найден`);
    }
  }

  async update(id: string, dto: UpdatePetTypeDto): Promise<PetType> {
    const petType = await this.findOne(id);
    Object.assign(petType, dto);
    return await this.manager.save(petType);
  }

  async delete(id: string): Promise<void> {
    await this.manager.delete(PetType, {
      id: id,
    });
  }
}
