import { Injectable, NotFoundException } from '@nestjs/common';
import { EntityManager } from 'typeorm';
import { CreateStoryDto } from './dto/createStory.dto';
import { Story } from './entities/story.entity';
import { UpdateStoryDto } from './dto/updateStory.dto';
import { ImageUploadService } from 'src/image-upload/image-upload.service';

@Injectable()
export class StoriesService {
  constructor(
    private readonly manager: EntityManager,
    private readonly imageUploadService: ImageUploadService
  ) {}

  async create(
    dto: CreateStoryDto,
    image: Express.Multer.File
  ): Promise<Story> {
    const imageUrl = await this.imageUploadService.uploadImageToImgbb(image);
    const story = this.manager.create(Story, {
      title: dto.title,
      description: dto.description,
      image: imageUrl,
    });
    return await this.manager.save(story);
  }

  async findAll(): Promise<Story[]> {
    return this.manager.find(Story);
  }

  async findOne(id: string): Promise<Story> {
    try {
      return await this.manager.findOneOrFail(Story, {
        where: { id: id },
      });
    } catch (error) {
      throw new NotFoundException(`История с ID ${id} не найдена`);
    }
  }

  async update(
    id: string,
    dto: UpdateStoryDto,
    image?: Express.Multer.File
  ): Promise<Story> {
    const story = await this.findOne(id);
    if (image) {
      const imageUrl = await this.imageUploadService.uploadImageToImgbb(image);
      story.image = imageUrl;
    } else {
      delete dto.image;
    }

    Object.assign(story, dto);
    return await this.manager.save(story);
  }

  async delete(id: string): Promise<void> {
    await this.manager.delete(Story, {
      id: id,
    });
  }
}
