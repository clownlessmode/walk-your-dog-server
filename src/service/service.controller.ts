import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  Query,
} from '@nestjs/common';
import { ServiceService } from './service.service';
import { Service } from './entities/service.entity';
import {
  ApiTags,
  ApiOperation,
  ApiParam,
  ApiQuery,
  ApiBody,
} from '@nestjs/swagger';

@ApiTags('services')
@Controller('services')
export class ServiceController {
  constructor(private readonly serviceService: ServiceService) {}
  /*
  @Get()
  @ApiOperation({ summary: 'Получить список услуг по условиям' })
  @ApiQuery({ name: 'type', required: false, description: 'Тип услуги' })
  async findAll(@Query('type') type?: string): Promise<Service[]> {
    const conditions = type ? { type } : {};
    return this.serviceService.findServices(conditions);
  }
  */

  @Post()
  @ApiOperation({ summary: 'Создать новую услугу' })
  @ApiBody({ type: Service })
  async create(@Body() data: Partial<Service>): Promise<Service> {
    return this.serviceService.createService(data);
  }

  /*
  @Put(':id')
  @ApiOperation({ summary: 'Обновить услугу по ID' })
  @ApiParam({ name: 'id', description: 'ID услуги' })
  @ApiBody({ type: Service })
  async update(@Param('id') id: number, @Body() data: Partial<Service>): Promise<Service> {
    return this.serviceService.updateService(id, data);
  }*/
  /*

  @Delete(':id')
  @ApiOperation({ summary: 'Удалить услугу по ID' })
  @ApiParam({ name: 'id', description: 'ID услуги' })
  async delete(@Param('id') id: number): Promise<void> {
    return this.serviceService.deleteService(id);
  }*/
}
