import { Body, Controller, Get, Logger, Param, Post } from '@nestjs/common';
import { AbonementsService } from './abonements.service';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { CreateAbonementDto } from './dto/createAbonement.dto';
import { Abonement } from './entities/abonement.entity';
import { UserAbonement } from './entities/userAbonement.entity';
import { buyAbonementDto } from './dto/buyAbonement.dto';
@ApiTags('Abonements')
@Controller('abonements')
export class AbonementsController {
  constructor(private readonly abonementsService: AbonementsService) {}
  logger = new Logger('Abonements');

  @Post()
  @ApiOperation({ summary: 'Create a new abonement entry' })
  async create(@Body() dto: CreateAbonementDto): Promise<Abonement> {
    const abonement = await this.abonementsService.create(dto);
    this.logger.debug(
      `Создан новый абонемент: ${dto.abonementType}, ${dto.total}`
    );
    return abonement;
  }

  @Get()
  @ApiOperation({ summary: 'Retrieve all abonements' })
  async findAll(): Promise<Abonement[]> {
    const abonement = this.abonementsService.findAll();
    this.logger.debug(`Пользователь получил все абонементы`);
    return abonement;
  }

  @Get('by/:id')
  @ApiOperation({ summary: 'Retrieve all abonements from user' })
  async findBy(@Param('id') id: string): Promise<UserAbonement[]> {
    const abonement = this.abonementsService.findBy(id);
    this.logger.debug(`Пользователь получил все абонементы у ${id}`);
    return abonement;
  }

  @Post('/buy')
  @ApiOperation({ summary: 'Buy a new abonement entry' })
  async buyAbonement(@Body() dto: buyAbonementDto): Promise<UserAbonement> {
    const abonement = this.abonementsService.buy(dto);
    this.logger.debug(`Пользователь купил абонемент ${dto.abonementId}`);
    return abonement;
  }
}
