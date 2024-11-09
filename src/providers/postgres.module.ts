import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule, TypeOrmModuleOptions } from '@nestjs/typeorm';
import { Abonement } from 'src/abonements/entities/abonement.entity';
import { UserAbonement } from 'src/abonements/entities/userAbonement.entity';
import { Address } from 'src/adresses/entities/address.entity';
import { Balance } from 'src/balance/entities/balance.entity';
import { Breed } from 'src/breed/entities/breed.entity';
import { Dialog } from 'src/chats/entities/dialog.entity';
import { Message } from 'src/chats/entities/message.entity';
import { Payment } from 'src/payments/entities/payment.entity';
import { PetType } from 'src/pet-types/entities/pet-type.entity';
import { Pet } from 'src/pets/entities/pet.entity';
import { PetParameters } from 'src/pets/entities/petParameters.entity';
import { Reminder } from 'src/reminders/entities/reminder.entity';
import { MainService } from 'src/service/entities/main-service.entity';
import { Service } from 'src/service/entities/service.entity';
import { SubService } from 'src/service/entities/sub-service.entity';
import { Story } from 'src/stories/entities/story.entity';
import { Meta } from 'src/users/entites/meta.entity';
import { User } from 'src/users/entites/user.entity';
import { Worker } from 'src/users/entites/worker.entity';
import { Vaccine } from 'src/vaccines/entities/vaccine.entity';

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService): TypeOrmModuleOptions => {
        return {
          type: configService.getOrThrow<'postgres'>('DATABASE_TYPE'),
          host: configService.getOrThrow<string>('DATABASE_HOST'),
          port: configService.getOrThrow<number>('DATABASE_PORT'),
          username: configService.getOrThrow<string>('DATABASE_USERNAME'),
          password: configService.getOrThrow<string>('DATABASE_PASSWORD'),
          database: configService.getOrThrow<string>('DATABASE_DATABASE'),
          autoLoadEntities: true,
          synchronize: true,
          useUTC: true,
          poolSize: 20,
          entities: [
            Story,
            Vaccine,
            User,
            Meta,
            Pet,
            PetType,
            Breed,
            PetParameters,
            Message,
            Dialog,
            Balance,
            Payment,
            Reminder,
            Abonement,
            UserAbonement,
            Address,
            MainService,
            Service,
            SubService,
            Worker,
          ],
        };
      },
    }),
  ],
})
export class PostgresModule {}
