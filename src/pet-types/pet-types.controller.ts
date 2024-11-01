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
import { PetTypesService } from './pet-types.service';
import { createpettypedto } from './dto/createpettype.dto';
import { PetType } from './entities/pet-type.entity';
import { UpdatePetTypeDto } from './dto/updatePetType.dto';

@ApiTags('Pet Types')
@Controller('pet-types')
export class PetTypesController {
  constructor(private readonly petTypesService: PetTypesService) {}
  logger = new Logger('PetTypes');
  @Post()
  @ApiOperation({ summary: 'Create a new pet type entry' })
  async create(@Body() dto: createpettypedto): Promise<PetType> {
    const petType = await this.petTypesService.create(dto);
    this.logger.debug(`Создан новый вид питомца: ${dto.type}`);
    return petType;
  }

  @Get()
  @ApiOperation({ summary: 'Retrieve all pet types' })
  async findAll(): Promise<PetType[]> {
    const petTypes = this.petTypesService.findAll();
    this.logger.debug(`Пользователь получил все виды питомцев`);
    return petTypes;
  }

  @Get(':id')
  @ApiOperation({ summary: 'Retrieve a specific pet type by ID' })
  async findOne(@Param('id') id: string): Promise<PetType> {
    const petType = await this.petTypesService.findOne(id);
    this.logger.debug(
      `Пользователь получил вид питомца: ${petType.type} (ID: ${id})`
    );
    return petType;
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a pet type by ID' })
  async update(
    @Param('id') id: string,
    @Body() dto: UpdatePetTypeDto
  ): Promise<PetType> {
    const petType = await this.petTypesService.update(id, dto);
    this.logger.debug(
      `Пользователь обновил вид питомца: ${petType.type} (ID: ${id})`
    );
    return petType;
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a pet type by ID' })
  async delete(@Param('id') id: string): Promise<void> {
    const petType = await this.petTypesService.delete(id);
    this.logger.debug(`Пользователь удалил вид питомца: ${id}`);
    return petType;
  }
}
