import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { EntityManager } from 'typeorm';
import { User } from './entites/user.entity';
import { SendSmsDto } from 'src/auth/dto/sendSms.dto';
import { lastValueFrom } from 'rxjs';
import { HttpService } from '@nestjs/axios';
import { UpdateTelephoneDto } from './dto/UpdateEmail.dto';

@Injectable()
export class UsersService {
  private smsCodes = new Map<string, string>();

  constructor(
    private readonly manager: EntityManager,
    private readonly httpService: HttpService
  ) {}
  async findAll(): Promise<User[]> {
    return this.manager.find(User, {
      relations: {
        abonements: {
          abonement: true,
        },
        meta: { addresses: true },
        balance: {
          payments: true,
        },
        pets: {
          parameters: {
            vaccines: true,
          },
          breed: {
            petType: true,
          },
        },
        worker: {
          petTypes: true,
          services: true,
        },
      },
    });
  }
  async delete(id: string): Promise<'User successfully deleted'> {
    this.manager.delete(User, {
      id: id,
    });
    return 'User successfully deleted';
  }
  async findByRefreshToken(refreshToken: string): Promise<User | null> {
    return await this.manager.findOne(User, { where: { refreshToken } });
  }
  async findOne(id: string): Promise<User> {
    try {
      return this.manager.findOneOrFail(User, {
        where: { id: id },
        relations: {
          abonements: {
            abonement: true,
          },
          meta: { addresses: true },
          balance: {
            payments: true,
          },
          pets: {
            parameters: {
              vaccines: true,
            },
            breed: {
              petType: true,
            },
          },
          worker: {
            petTypes: true,
            services: true,
          },
        },
      });
    } catch (error) {
      throw new NotFoundException(`Пользователь с ID ${id} не найден`);
    }
  }
  async updateTelephone(id: string, dto: UpdateTelephoneDto): Promise<User> {
    const user = await this.findOne(id);
    await this.verifySmsCode(dto);
    user.meta.telephone = dto.telephone;
    return await this.manager.save(user);
  }

  async sendTelephoneCode(dto: SendSmsDto): Promise<{ DEVCODE: string }> {
    const smsCode = await this.sendSmsCode(dto);
    return { DEVCODE: smsCode };
  }

  async sendSmsCode(dto: SendSmsDto): Promise<string> {
    const code = Math.floor(1000 + Math.random() * 9000).toString();
    this.smsCodes.set(dto.telephone, code);

    await lastValueFrom(
      this.httpService.get(
        `https://sms.ru/sms/send?api_id=CE3BD9BA-8AAF-C076-0BB3-311073F74D82&to=79609177131&msg=${code}&json=1`
      )
    );
    return code;
  }
  async verifySmsCode(dto: UpdateTelephoneDto): Promise<boolean> {
    const storedCode = this.smsCodes.get(dto.telephone);
    const isValid = storedCode === dto.code;
    if (!isValid) {
      throw new UnauthorizedException('Неверный SMS - Код');
    }
    return true;
  }
}
