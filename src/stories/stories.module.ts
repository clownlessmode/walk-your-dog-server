import { Module } from '@nestjs/common';
import { StoriesService } from './stories.service';
import { StoriesController } from './stories.controller';
import { ImageUploadService } from 'src/image-upload/image-upload.service';

@Module({
  controllers: [StoriesController],
  providers: [StoriesService, ImageUploadService],
})
export class StoriesModule {}
