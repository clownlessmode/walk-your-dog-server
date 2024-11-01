import { Module } from '@nestjs/common';
import { EnvFilePathModule } from './providers/env-file-path.module';
import { StoriesModule } from './stories/stories.module';
import { PostgresModule } from './providers/postgres.module';
import { VaccinesModule } from './vaccines/vaccines.module';
import { UsersModule } from './users/users.module';
import { PetTypesModule } from './pet-types/pet-types.module';
import { AuthModule } from './auth/auth.module';
import { PetsModule } from './pets/pets.module';
import { BalanceModule } from './balance/balance.module';
import { PaymentsModule } from './payments/payments.module';

import { ImageUploadService } from './image-upload/image-upload.service';
import { BreedModule } from './breed/breed.module';
import { ServiceModule } from './service/service.module';
import { RemindersModule } from './reminders/reminders.module';
import { ScheduleModule } from '@nestjs/schedule';
import { AbonementsModule } from './abonements/abonements.module';
import { AdressesModule } from './adresses/adresses.module';

@Module({
  imports: [
    ScheduleModule.forRoot(),
    EnvFilePathModule,
    PostgresModule,
    AuthModule,
    UsersModule,
    StoriesModule,
    VaccinesModule,
    PetsModule,
    BreedModule,
    PetTypesModule,
    BalanceModule,
    PaymentsModule,
    ServiceModule,
    RemindersModule,
    AbonementsModule,
    AdressesModule,
  ],
  controllers: [],
  providers: [ImageUploadService],
})
export class AppModule {}
