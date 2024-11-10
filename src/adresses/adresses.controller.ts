import { Body, Controller, Logger, Param, Patch, Post } from '@nestjs/common';
import { AdressesService } from './adresses.service';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { CreateAddressDto } from './dto/CreateAdress.dto';
import { UpdateAddressDto } from './dto/UpdateAdress.dto';
import { Address } from './entities/address.entity';
@ApiTags('Adresses')
@Controller('adresses')
export class AdressesController {
  constructor(private readonly adressesService: AdressesService) {}
  logger = new Logger('Addresses');
  @Post()
  @ApiOperation({ summary: 'Create a new address entry' })
  async create(@Body() dto: CreateAddressDto): Promise<any> {
    const address = await this.adressesService.create(dto);
    this.logger.debug(`Создан новый адресс: ${dto.address}`);
    return address;
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update an address by ID' })
  async update(
    @Param('id') id: string,
    @Body() dto: UpdateAddressDto
  ): Promise<Address> {
    const address = await this.adressesService.update(id, dto);
    this.logger.debug(`Адрес обновлен: ${address.address} (ID: ${id})`);
    return address;
  }
}
