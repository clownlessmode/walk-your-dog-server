import { Injectable, NotFoundException } from '@nestjs/common';
import { EntityManager } from 'typeorm';
import { CreateBreedDto } from './dto/createBreed.dto';
import { Breed } from './entities/breed.entity';
import { UpdateBreedDto } from './dto/updateBreed.dto';
import { PetTypesService } from 'src/pet-types/pet-types.service';

@Injectable()
export class BreedService {
  constructor(
    private readonly manager: EntityManager,
    private readonly petTypeService: PetTypesService
  ) {}

  async create(dto: CreateBreedDto): Promise<Breed> {
    const petType = await this.petTypeService.findOne(dto.type);
    const breed = this.manager.create(Breed, {
      name: dto.name,
      petType: petType,
    });
    return await this.manager.save(breed);
  }

  async findAll(): Promise<Breed[]> {
    return this.manager.find(Breed, {
      relations: {
        petType: true,
      },
    });
  }

  async findOne(id: string): Promise<Breed> {
    try {
      return await this.manager.findOneOrFail(Breed, {
        where: { id: id },
      });
    } catch (error) {
      throw new NotFoundException(`Порода с ID ${id} не найдена`);
    }
  }

  async findBy(id: string): Promise<Breed[]> {
    const petType = await this.petTypeService.findOne(id);
    const breeds = await this.manager.find(Breed, {
      where: { petType: { id: petType.id } },
    });
    return breeds;
  }

  async update(id: string, dto: UpdateBreedDto): Promise<Breed> {
    const breed = await this.findOne(id);
    if (dto.type) {
      const petType = await this.petTypeService.findOne(dto.type);
      breed.petType = petType;
    }
    Object.assign(breed, dto);
    return await this.manager.save(breed);
  }

  async delete(id: string): Promise<void> {
    await this.manager.delete(Breed, {
      id: id,
    });
  }
}
