import {
  Body,
  Controller,
  Delete,
  Get,
  Logger,
  Param,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { ApiConsumes, ApiOperation, ApiTags } from '@nestjs/swagger';
import { FileInterceptor } from '@nestjs/platform-express';
import { CreatePetDto } from './dto/CreatePet.dto';
import { Pet } from './entities/pet.entity';
import { PetsService } from './pets.service';
import { Service } from 'src/service/entities/service.entity';

@ApiTags('Pets')
@Controller('pets')
export class PetsController {
  constructor(private readonly petsService: PetsService) {}

  logger = new Logger('Pets');
  @Post()
  @UseInterceptors(FileInterceptor('image', {}))
  @ApiConsumes('multipart/form-data')
  @ApiOperation({ summary: 'Create a new pet entry' })
  async create(
    @Body() dto: CreatePetDto,
    @UploadedFile() image: Express.Multer.File
  ): Promise<Pet> {
    const pet = await this.petsService.create(dto, image);
    this.logger.debug(`Создан новый питомец: ${dto.name}`);
    return pet;
  }

  @Get()
  @ApiOperation({ summary: 'Retrieve all pets' })
  async findAll(): Promise<Pet[]> {
    const pets = this.petsService.findAll();
    this.logger.debug(`Пользователь получил всех питомцев`);
    return pets;
  }

  @Get(':id')
  @ApiOperation({ summary: 'Retrieve a specific pet by ID' })
  async findOne(
    @Param('id') id: string
  ): Promise<{ pet: Pet; services: Service[] }> {
    const pet = await this.petsService.findOne(id);
    this.logger.debug(
      `Пользователь получил питомца: ${pet.pet.name} (ID: ${id})`
    );
    return pet;
  }

  @Get('/by/:id')
  @ApiOperation({ summary: 'Retrieve a specific pet by user ID' })
  async findBy(@Param('id') id: string): Promise<Pet[]> {
    const pets = await this.petsService.findBy(id);
    this.logger.debug(
      `Пользователь получил всех питомцев у пользователя (ID: ${id})`
    );
    return pets;
  }

  // @Patch(':id')
  // @UseInterceptors(FileInterceptor('image', {}))
  // @ApiConsumes('multipart/form-data')
  // @ApiOperation({ summary: 'Update a pet by ID' })
  // async update(
  //   @Param('id') id: string,
  //   @Body() dto: UpdatePetDto,
  //   @UploadedFile() image: Express.Multer.File
  // ): Promise<Pet> {
  //   const story = await this.PetsService.update(id, dto, image);
  //   this.logger.debug(
  //     `Пользователь обновил историю: ${story.title} (ID: ${id})`
  //   );
  //   return story;
  // }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a pet by ID' })
  async delete(@Param('id') id: string): Promise<void> {
    await this.petsService.delete(id);
    this.logger.debug(`Пользователь удалил питомца с ID: ${id}`);
  }
}
