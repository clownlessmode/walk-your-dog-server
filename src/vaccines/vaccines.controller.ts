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
import { VaccinesService } from './vaccines.service';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { CreateVaccineDto } from './dto/createVaccine.dto';
import { UpdateVaccineDto } from './dto/updateVaccine.dto';
import { Vaccine } from './entities/vaccine.entity';
@ApiTags('Vaccines')
@Controller('vaccines')
export class VaccinesController {
  constructor(private readonly vaccinesService: VaccinesService) {}
  logger = new Logger('Vaccines');
  @Post()
  @ApiOperation({ summary: 'Create a new vaccine entry' })
  async create(@Body() dto: CreateVaccineDto): Promise<Vaccine> {
    const vaccine = await this.vaccinesService.create(dto);
    this.logger.debug(`Создана новая вакцина: ${dto.name}`);
    return vaccine;
  }

  @Get()
  @ApiOperation({ summary: 'Retrieve all vaccines' })
  async findAll(): Promise<Vaccine[]> {
    const vaccines = this.vaccinesService.findAll();
    this.logger.debug(`Пользователь получил все вакцины`);
    return vaccines;
  }

  @Get(':id')
  @ApiOperation({ summary: 'Retrieve a specific vaccine by ID' })
  async findOne(@Param('id') id: string): Promise<Vaccine> {
    const vaccine = await this.vaccinesService.findOne(id);
    this.logger.debug(
      `Пользователь получил вакцину: ${vaccine.name} (ID: ${id})`
    );
    return vaccine;
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a vaccine by ID' })
  async update(
    @Param('id') id: string,
    @Body() dto: UpdateVaccineDto
  ): Promise<Vaccine> {
    const vaccine = await this.vaccinesService.update(id, dto);
    this.logger.debug(
      `Пользователь обновил вакцину: ${vaccine.name} (ID: ${id})`
    );
    return vaccine;
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a vaccine by ID' })
  async delete(@Param('id') id: string): Promise<void> {
    const vaccine = await this.vaccinesService.delete(id);
    this.logger.debug(`Пользователь удалил вакцину: ${id}`);
    return vaccine;
  }
}
