import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from 'src/users/users.service';
import { SignUpDto } from './dto/signup.dto';
import { SendSmsDto } from './dto/sendSms.dto';
import { DeepPartial, EntityManager, In } from 'typeorm';
import { User } from 'src/users/entites/user.entity';
import { Balance } from 'src/balance/entities/balance.entity';
import { HttpService } from '@nestjs/axios';
import { lastValueFrom } from 'rxjs';
import { verifyCodeDto } from './dto/verifyCode.dto';
import { RefreshDto } from './dto/refresh.dto';
import { ImageUploadService } from 'src/image-upload/image-upload.service';
import { Worker } from 'src/users/entites/worker.entity';
import { PetType } from 'src/pet-types/entities/pet-type.entity';
import { MainService } from 'src/service/entities/main-service.entity';
@Injectable()
export class AuthService {
  private smsCodes = new Map<string, string>();

  constructor(
    private readonly manager: EntityManager,
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
    private readonly httpService: HttpService,
    private readonly imageUploadService: ImageUploadService
  ) {}
  async verifySmsCode(
    dto: verifyCodeDto
  ): Promise<{ accessToken: string | null; user: User | null }> {
    const storedCode = this.smsCodes.get(dto.telephone);
    const isValid = storedCode === dto.code;

    if (!isValid) {
      throw new UnauthorizedException('Неверный SMS - Код');
    }

    const user = await this.manager.findOne(User, {
      where: {
        meta: {
          telephone: dto.telephone,
        },
      },
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

    if (user) {
      const accessToken = this.jwtService.sign({
        sub: user.id,
        role: user.meta?.role,
      });

      return {
        accessToken: accessToken,
        user: user,
      };
    } else {
      return {
        accessToken: null,
        user: null,
      };
    }
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

  async preauth(dto: SendSmsDto) {
    const user = await this.manager.findOne(User, {
      where: {
        meta: {
          telephone: dto.telephone,
        },
      },
    });
    const smsCode = await this.sendSmsCode(dto);

    return {
      isRegistered: !!user,
      code: !!smsCode,
      DEVCODE: smsCode,
    };
  }

  async signup(dto: SignUpDto, file: Express.Multer.File): Promise<any> {
    const existingUser = await this.manager.findOne(User, {
      where: [
        { meta: { email: dto.email } },
        { meta: { telephone: dto.telephone } },
      ],
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

    let imageUrl: string | null = null;

    if (file) {
      imageUrl = await this.imageUploadService.uploadImageToImgbb(file);
    }

    if (existingUser) {
      throw new UnauthorizedException(
        'User with this email or telephone already exists'
      );
    }

    const refreshToken = this.generateRefreshToken(dto.telephone);

    // Check if a promo code is provided and find the corresponding user
    let promouser = null;
    if (dto.promocode) {
      promouser = await this.manager.findOne(User, {
        where: { meta: { promocode: dto.promocode } },
        relations: { balance: true },
      });

      // If a user with the provided promo code is found, ensure the balance exists
      if (promouser) {
        if (!promouser.balance) {
          promouser.balance = this.manager.create(Balance, { promo: 0 });
        }
        promouser.balance.promo += 1000;
        await this.manager.save(User, promouser);
      }
    }

    // Generate a unique promo code for the new user
    let promoCode: string;
    do {
      promoCode = this.generatePromoCode();
    } while (await this.promoCodeExists(promoCode));

    let worker = null;
    console.log('DTO NA AUTH', dto);
    if (dto.start && dto.end && dto.days && dto.petTypes && dto.services) {
      console.log('VSE YEST');
      // Получаем PetType объекты по их ID
      if (typeof dto.petTypes === 'string') {
        dto.petTypes = dto.petTypes.split(',');
      }
      if (typeof dto.services === 'string') {
        dto.services = dto.services.split(',');
      }

      // Получаем PetType объекты по их ID
      const petTypes = await this.manager.findBy(PetType, {
        id: In(dto.petTypes),
      });

      // Получаем MainService объекты по их ID
      const services = await this.manager.findBy(MainService, {
        id: In(dto.services),
      });

      // Создаем worker
      const workerData: DeepPartial<Worker> = {
        start: dto.start,
        end: dto.end,
        days: dto.days,
        petTypes: petTypes,
        services: services,
      };

      worker = this.manager.create(Worker, workerData);
      worker = await this.manager.save(Worker, worker);
    }

    // Create and save the new user
    const userData = this.manager.create(User, {
      refreshToken: refreshToken,
      meta: {
        name: dto.name,
        email: dto.email,
        telephone: dto.telephone,
        city: dto.city,
        role: dto.role,
        promocode: promoCode,
        image: imageUrl || null,
      },
      balance: this.manager.create(Balance, {}),
      worker: worker,
    });

    const newUser = await this.manager.save(User, userData);

    const user = await this.manager.findOne(User, {
      where: { id: newUser.id },
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
    // Generate access token for the new user
    const accessToken = this.jwtService.sign({
      sub: user.id,
      role: user.meta.role,
    });

    return {
      accessToken: accessToken,
      user: user,
    };
  }

  private generatePromoCode(length = 5): string {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let result = '';
    for (let i = 0; i < length; i++) {
      result += characters.charAt(
        Math.floor(Math.random() * characters.length)
      );
    }
    return result;
  }

  private async promoCodeExists(code: string): Promise<boolean> {
    const existingCode = await this.manager.findOne(User, {
      where: { meta: { promocode: code } },
    });
    return !!existingCode;
  }

  async refreshToken(dto: RefreshDto): Promise<{ access: string }> {
    if (!dto.refreshToken) {
      throw new UnauthorizedException('Refresh token not found, Check Cookies');
    }
    const user = await this.usersService.findByRefreshToken(dto.refreshToken);
    if (!user) {
      throw new UnauthorizedException('Invalid refresh token');
    }

    const accessToken = this.jwtService.sign({ id: user.id });
    return { access: accessToken };
  }
  private generateRefreshToken(telephone: string): string {
    return this.jwtService.sign(
      { telephone }, // Полезная нагрузка токена (например, email пользователя)
      { expiresIn: '7d' }
    );
  }
}
