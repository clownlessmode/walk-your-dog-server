import { Module } from '@nestjs/common';
import { AdressesService } from './adresses.service';
import { AdressesController } from './adresses.controller';
import { UsersModule } from 'src/users/users.module';

@Module({
  controllers: [AdressesController],
  providers: [AdressesService],
  imports: [UsersModule],
})
export class AdressesModule {}
