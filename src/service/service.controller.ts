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

@ApiTags('Service')
@Controller('service')
export class ServiceController {
  constructor(private readonly serviceService: ServiceService) {}

  logger = new Logger('Services');

  // All Services
  @Get('catalog')
  @ApiOperation({ summary: 'Retrieve all services' })
  async getCatalog(): Promise<any> {
    const services = await this.serviceService.getCatalog();
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
