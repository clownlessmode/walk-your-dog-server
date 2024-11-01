import { Module } from '@nestjs/common';
import { PetTypesService } from './pet-types.service';
import { PetTypesController } from './pet-types.controller';

@Module({
  controllers: [PetTypesController],
  providers: [PetTypesService],
})
export class PetTypesModule {}
