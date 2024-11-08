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
import { CreateServiceValueDto } from './dto/createServiceValue.dto';
import { ServiceValue } from './entities/service-value.entity';
import { CreateAdditionalDto } from './dto/createAdditional.dto';

@ApiTags('serviceValues')
@Controller('serviceValues')
export class ServiceController {
  constructor(private readonly serviceService: ServiceService) {}
  @Post()
  @ApiOperation({ summary: 'Create a new service value entry' })
  async create(@Body() dto: CreateServiceValueDto): Promise<ServiceValue> {
    const serviceValue = await this.serviceService.create(dto);
    console.log(`Created new service: ${dto.name}`);
    return serviceValue;
  }

  @Post(':id/additional')
  @ApiOperation({ summary: 'Add an additional service to a service value' })
  async addAdditional(
    @Param('id') serviceId: string,
    @Body() additionalDto: CreateAdditionalDto
  ): Promise<ServiceValue> {
    return await this.serviceService.addAdditional(serviceId, additionalDto);
  }

  @Patch(':id/additional/:additionalId')
  @ApiOperation({
    summary: 'Remove an additional service from a service value',
  })
  async removeAdditional(
    @Param('id') serviceId: string,
    @Param('additionalId') additionalId: string
  ): Promise<ServiceValue> {
    return await this.serviceService.removeAdditional(serviceId, additionalId);
  }

  @Delete(':id')
  @ApiOperation({
    summary: 'Delete a service value including its additional services',
  })
  async deleteServiceValue(@Param('id') serviceId: string): Promise<void> {
    await this.serviceService.deleteServiceValue(serviceId);
  }

  @Get()
  @ApiOperation({
    summary: 'Get all service values',
  })
  async findAll(): Promise<ServiceValue[]> {
    return await this.serviceService.findAll();
  }
}
