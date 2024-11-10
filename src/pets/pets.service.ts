import { Injectable, NotFoundException } from '@nestjs/common';
import { EntityManager, In } from 'typeorm';
import { Pet } from './entities/pet.entity';
import { CreatePetDto } from './dto/CreatePet.dto';
import { PetParameters } from './entities/petParameters.entity';
import { ImageUploadService } from 'src/image-upload/image-upload.service';
import { UsersService } from 'src/users/users.service';
import { BreedService } from 'src/breed/breed.service';
import { VaccinesService } from 'src/vaccines/vaccines.service';
import { Service } from 'src/service/entities/service.entity';

@Injectable()
export class PetsService {
  constructor(
    private readonly manager: EntityManager,
    private readonly imageUploadService: ImageUploadService,
    private readonly usersService: UsersService,
    private readonly breedService: BreedService,
    private readonly vaccinesService: VaccinesService
  ) {}

  async create(dto: CreatePetDto, file: Express.Multer.File): Promise<Pet> {
    const user = await this.usersService.findOne(dto.owner);
    const breed = await this.breedService.findOne(dto.breed);
    const vaccines = await this.vaccinesService.findMany(dto.vaccine);
    const petParameters = this.manager.create(PetParameters, {
      gender: dto.gender,
      sterilized: dto.sterilized,
      aggressive: dto.aggressive,
      pulls: dto.pulls,
      health: dto.health,
      additional: dto.additional,
      vaccines: vaccines,
    });

    const imageUrl = file
      ? await this.imageUploadService.uploadImageToImgbb(file)
      : null;

    const pet = this.manager.create(Pet, {
      name: dto.name,
      birthdate: dto.birthdate,
      breed: breed,
      owner: user,
      parameters: petParameters,
      image: imageUrl,
    });

    return await this.manager.save(Pet, pet);
  }

  async findAll(): Promise<Pet[]> {
    return this.manager.find(Pet, {
      relations: {
        breed: { petType: true },
        parameters: { vaccines: true },
        owner: true,
      },
    });
  }

  async findOne(id: string): Promise<{ pet: Pet; services: Service[] }> {
    try {
      const services = await this.manager.find(Service, {
        where: {
          pet: { id: id },
        },
      });

      const pet = await this.manager.findOneOrFail(Pet, {
        where: { id: id },
        relations: {
          breed: { petType: true },
          parameters: { vaccines: true },
          reminders: true,
        },
      });
      return { pet: pet, services: services };
    } catch (error) {
      throw new NotFoundException(`Питомец с ID ${id} не найден`);
    }
  }

  async findBy(id: string): Promise<Pet[]> {
    const petType = await this.usersService.findOne(id);
    const pets = await this.manager.find(Pet, {
      where: { owner: { id: petType.id } },
      relations: { breed: { petType: true }, parameters: { vaccines: true } },
    });
    return pets;
  }

  async findMany(ids: string[]): Promise<Pet[]> {
    const pets = await this.manager.findBy(Pet, {
      id: In(ids),
    });
    if (pets.length !== ids.length) {
      throw new NotFoundException('Не все запрашиваемые питомцы найдены');
    }
    return pets;
  }

  async delete(id: string): Promise<void> {
    // Найти питомца с его параметрами
    const pet = await this.manager.findOne(Pet, {
      where: { id },
      relations: ['parameters'],
    });

    if (!pet) {
      throw new NotFoundException(`Питомец с ID ${id} не найден`);
    }
    // Удалить питомца из базы данных
    await this.manager.remove(Pet, pet);
  }
}
