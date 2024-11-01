import { Body, Controller, Logger, Post } from '@nestjs/common';
import { AdressesService } from './adresses.service';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { CreateAddressDto } from './dto/CreateAdress.dto';
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
}
