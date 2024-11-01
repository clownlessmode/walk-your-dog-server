import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { EntityManager, In } from 'typeorm';
import { CreateRemindDto } from './dto/CreateRemind.dto';
import { Reminder } from './entities/reminder.entity';
import { Cron, CronExpression } from '@nestjs/schedule';
import { Pet } from 'src/pets/entities/pet.entity';
import axios from 'axios';
import { reminderType } from './enums/reminderType.enum';

@Injectable()
export class RemindersService {
  private readonly logger = new Logger(RemindersService.name);

  constructor(private readonly manager: EntityManager) {}

  async create(dto: CreateRemindDto): Promise<Reminder> {
    const pets = await this.manager.findBy(Pet, {
      id: In(dto.pet),
    });
    if (pets.length !== dto.pet.length) {
      throw new NotFoundException('Не все запрашиваемые питомцы найдены');
    }
    const reminder = this.manager.create(Reminder, {
      pets,
      ...dto,
    });
    return await this.manager.save(reminder);
  }

  async findAll(): Promise<Reminder[]> {
    return this.manager.find(Reminder, {
      relations: ['pets'],
    });
  }

  @Cron(CronExpression.EVERY_MINUTE)
  async checkReminders() {
    const reminders = await this.manager.find(Reminder, {
      relations: { pets: { owner: true } },
    });

    const now = new Date();
    const currentDayOfWeek = now.getUTCDay(); // Получаем текущий день недели (0 - воскресенье, 6 - суббота)

    reminders.forEach(async (reminder) => {
      const reminderTime = new Date(reminder.datetime);
      reminderTime.setHours(reminderTime.getHours() - reminder.remind);

      if (now >= reminderTime) {
        this.logger.log(
          `Напоминание для пользователя ${reminder.id}: ${reminder.reminderType}`
        );
        if (
          reminder.repeatDays &&
          reminder.repeatDays.includes(currentDayOfWeek)
        ) {
          this.logger.log(
            `Напоминание установлено на повтор в день недели: ${currentDayOfWeek}`
          );

          // Отправка уведомления для каждого питомца
          for (const pet of reminder.pets) {
            const { title, description } = this.getReminder(
              pet.name,
              reminder.reminderType
            );
            try {
              const response = await axios.post(
                `https://app.nativenotify.com/api/indie/notification`,
                {
                  subID: pet.owner.id,
                  appId: 24230,
                  appToken: 'F4CZByJ4fRNUi31zZPdEBp',
                  title: title,
                  message: description, // Используем description вместо статической строки
                }
              );
              console.log(response);
              this.logger.log(`Уведомление отправлено для ${pet.name}`);
            } catch (error) {
              this.logger.error(
                `Ошибка при отправке уведомления для ${pet.name}: ${error.message}`
              );
            }
          }
        } else {
          await this.manager.delete(Reminder, reminder.id);
          this.logger.log(`Напоминание удалено: ${reminder.id}`);
        }
      }
    });
  }

  getReminder(
    petName: string,
    type: reminderType
  ): { title: string; description: string } {
    const reminders: {
      [key in reminderType]: { title: string; description: string };
    } = {
      SUBSCRIBE: {
        title: `Пора записать на услуги ${petName}!`,
        description: `Не забудьте записаться на услуги для ${petName}!`,
      },
      VACCINATION: {
        title: `Время вакцинации для ${petName}!`,
        description: `Пора сделать прививку для ${petName}. Защитите его здоровье!`,
      },
      VETERINAR: {
        title: `Визит к ветеринару для ${petName}`,
        description: `Запланированный осмотр у ветеринара для ${petName} сегодня.`,
      },
      BATHING: {
        title: `Время купания для ${petName}!`,
        description: `${petName} пора освежиться. Не забудьте про купание!`,
      },
      GROOMING: {
        title: `Сеанс груминга для ${petName}`,
        description: `Пора привести в порядок шерсть ${petName}. Запишитесь на груминг!`,
      },
      NAILS: {
        title: `Не забывайте про коготочки ${petName}!`,
        description: `${petName} нужно подстричь когти. Запланируйте визит к грумеру.`,
      },
      PRIVIVKA: {
        title: `Не забывайте про прививание ${petName}!`,
        description: `Пора сделать прививку для ${petName}. Защитите его здоровье!`,
      },
      EARS: {
        title: `Не забывайте про ушки ${petName}!`,
        description: `Пора привести в порядок ушки ${petName}. Не забудьте!`,
      },
    };

    return reminders[type];
  }
}
