import { Module } from '@nestjs/common';
import { BreedService } from './breed.service';
import { BreedController } from './breed.controller';
import { PetTypesService } from 'src/pet-types/pet-types.service';

@Module({
  controllers: [BreedController],
  providers: [BreedService, PetTypesService],
})
export class BreedModule {}
