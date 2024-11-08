import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  Query,
  Patch,
  Logger,
} from '@nestjs/common';
import { ServiceService } from './service.service';
import {
  ApiTags,
  ApiOperation,
  ApiParam,
  ApiQuery,
  ApiBody,
} from '@nestjs/swagger';
import { CreateMainServiceDto } from './dto/create-main.dto';
import { MainService } from './entities/main-service.entity';
import { SubService } from './entities/sub-service.entity';
import { CreateSubServiceDto } from './dto/create-sub.dto';
import { CreateServiceDto } from './dto/create-service.dto';
import { Service } from './entities/service.entity';

@ApiTags('Service')
@Controller('service')
export class ServiceController {
  constructor(private readonly serviceService: ServiceService) {}

  logger = new Logger('Services');

  // Real Services
  @Post('create')
  @ApiOperation({ summary: 'create a service entry' })
  async createService(@Body() dto: CreateServiceDto): Promise<Service> {
    const service = await this.serviceService.createService(dto);
    this.logger.debug(
      `Создан новая неоплаченная услуга: ${dto.customerId}  ${dto.petId}`
    );
    return service;
  }

  @Get('customer/:id')
  @ApiOperation({ summary: 'Retrieve all services by customer id' })
  async getByCustomer(@Param('id') id: string): Promise<Service[]> {
    const services = await this.serviceService.getByCustomer(id);
    this.logger.debug(
      `Получен каталог услуг пользователя ${services[0].customer.meta.name}`
    );
    return services;
  }

  // All Services
  @Get('catalog')
  @ApiOperation({ summary: 'Retrieve all services' })
  async getCatalog(): Promise<
    {
      additional: any;
      name: string;
      price: number;
      id: string;
      created_at: string;
      updated_at: string;
    }[]
  > {
    const services = await this.serviceService.getCatalog();
    this.logger.debug(`Получен каталог услуг`);

    return services;
  }

  // Main Services
  @Post('main')
  @ApiOperation({ summary: 'Create a new main service entry' })
  async createMain(@Body() dto: CreateMainServiceDto): Promise<MainService> {
    const service = await this.serviceService.createMain(dto);
    this.logger.debug(`Создан новая услуга: ${dto.name}`);
    return service;
  }

  // Sub Services
  @Post('sub')
  @ApiOperation({ summary: 'Create a new sub service entry' })
  async createSub(@Body() dto: CreateSubServiceDto): Promise<SubService> {
    const service = await this.serviceService.createSub(dto);
    this.logger.debug(`Создан новая доп услуга: ${dto.name}`);
    return service;
  }
}
