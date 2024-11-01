import { Module } from '@nestjs/common';
import { PetsService } from './pets.service';
import { PetsController } from './pets.controller';
import { ImageUploadService } from 'src/image-upload/image-upload.service';
import { UsersService } from 'src/users/users.service';
import { BreedService } from 'src/breed/breed.service';
import { PetTypesService } from 'src/pet-types/pet-types.service';
import { VaccinesService } from 'src/vaccines/vaccines.service';
import { HttpModule } from '@nestjs/axios';

@Module({
  imports: [HttpModule],
  providers: [
    PetsService,
    ImageUploadService,
    UsersService,
    BreedService,
    PetTypesService,
    VaccinesService,
  ],
  controllers: [PetsController],
  exports: [PetsService],
})
export class PetsModule {}
