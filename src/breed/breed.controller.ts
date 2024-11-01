import {
  Body,
  Controller,
  Delete,
  Get,
  Logger,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { BreedService } from './breed.service';
import { Breed } from './entities/breed.entity';
import { CreateBreedDto } from './dto/createBreed.dto';
import { UpdateBreedDto } from './dto/updateBreed.dto';

@ApiTags('Breeds')
@Controller('breeds')
export class BreedController {
  constructor(private readonly breedService: BreedService) {}
  logger = new Logger('Breeds');
  @Post()
  @ApiOperation({ summary: 'Create a new breed entry' })
  async create(@Body() dto: CreateBreedDto): Promise<Breed> {
    const breed = await this.breedService.create(dto);
    this.logger.debug(`Создана новая порода: ${dto.name}`);
    return breed;
  }

  @Get()
  @ApiOperation({ summary: 'Retrieve all breeds' })
  async findAll(): Promise<Breed[]> {
    const breeds = this.breedService.findAll();
    this.logger.debug(`Пользователь получил все породы`);
    return breeds;
  }

  @Get(':id')
  @ApiOperation({ summary: 'Retrieve a specific breed by ID' })
  async findOne(@Param('id') id: string): Promise<Breed> {
    const breed = await this.breedService.findOne(id);
    this.logger.debug(`Пользователь получил породу: ${breed.name} (ID: ${id})`);
    return breed;
  }

  @Get('/by/:id')
  @ApiOperation({ summary: 'Retrieve a specific breed by pet type ID' })
  async findBy(@Param('id') id: string): Promise<Breed[]> {
    const breeds = await this.breedService.findBy(id);
    this.logger.debug(
      `Пользователь получил все породы у вида питомца (ID: ${id})`
    );
    return breeds;
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a breed by ID' })
  async update(
    @Param('id') id: string,
    @Body() dto: UpdateBreedDto
  ): Promise<Breed> {
    const breed = await this.breedService.update(id, dto);
    this.logger.debug(`Пользователь обновил породу: ${breed.name} (ID: ${id})`);
    return breed;
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a breed by ID' })
  async delete(@Param('id') id: string): Promise<void> {
    const breed = await this.breedService.delete(id);
    this.logger.debug(`Пользователь удалил породу: ${id}`);
    return breed;
  }
}
