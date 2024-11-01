import { Body, Controller, Get, Logger, Post } from '@nestjs/common';
import { RemindersService } from './reminders.service';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { Reminder } from './entities/reminder.entity';
import { CreateRemindDto } from './dto/CreateRemind.dto';
@ApiTags('Reminders')
@Controller('reminders')
export class RemindersController {
  constructor(private readonly remindersService: RemindersService) {}
  logger = new Logger('Reminders');

  @Post()
  @ApiOperation({ summary: 'Create a new remind entry' })
  async create(@Body() dto: CreateRemindDto): Promise<Reminder> {
    const reminder = await this.remindersService.create(dto);
    this.logger.debug(
      `Создано новое уведомление: ${dto.pet}, ${dto.reminderType}`
    );
    return reminder;
  }

  @Get()
  @ApiOperation({ summary: 'Retrieve all reminders' })
  async findAll(): Promise<Reminder[]> {
    const reminders = this.remindersService.findAll();
    this.logger.debug(`Пользователь получил все напоминания`);
    return reminders;
  }
}
