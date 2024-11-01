import { UpdatePetTypeDto } from './dto/updatePetType.dto';
import { Injectable, NotFoundException } from '@nestjs/common';
import { EntityManager } from 'typeorm';
// WTF?? What's wrong with this?
import { PetType } from './entities/pet-type.entity';
import { IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
class CreatePetTypeDto {
  @ApiProperty({ example: 'Собака' })
  @IsString({ message: 'Название вида питомца должно быть строкой' })
  @IsNotEmpty({ message: 'Вид питомца не может быть пустым' })
  type: string;
}
@Injectable()
export class PetTypesService {
  constructor(private readonly manager: EntityManager) {}

  async create(dto: CreatePetTypeDto): Promise<PetType> {
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
