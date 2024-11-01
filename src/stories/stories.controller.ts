import {
  Body,
  Controller,
  Delete,
  Get,
  Logger,
  Param,
  Patch,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { StoriesService } from './stories.service';
import { ApiConsumes, ApiOperation, ApiTags } from '@nestjs/swagger';
import { CreateStoryDto } from './dto/createStory.dto';
import { UpdateStoryDto } from './dto/updateStory.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { Story } from './entities/story.entity';

@ApiTags('Stories')
@Controller('stories')
export class StoriesController {
  constructor(private readonly storiesService: StoriesService) {}

  logger = new Logger('Stories');
  @Post()
  @UseInterceptors(FileInterceptor('image', {}))
  @ApiConsumes('multipart/form-data')
  @ApiOperation({ summary: 'Create a new story entry' })
  async create(
    @Body() dto: CreateStoryDto,
    @UploadedFile() image: Express.Multer.File
  ): Promise<Story> {
    const story = await this.storiesService.create(dto, image);
    this.logger.debug(`Создана новая история: ${dto.title}`);
    return story;
  }

  @Get()
  @ApiOperation({ summary: 'Retrieve all stories' })
  async findAll(): Promise<Story[]> {
    const stories = this.storiesService.findAll();
    this.logger.debug(`Пользователь получил все истории`);
    return stories;
  }

  @Get(':id')
  @ApiOperation({ summary: 'Retrieve a specific story by ID' })
  async findOne(@Param('id') id: string): Promise<Story> {
    const story = await this.storiesService.findOne(id);
    this.logger.debug(
      `Пользователь получил вакцину: ${story.title} (ID: ${id})`
    );
    return story;
  }

  @Patch(':id')
  @UseInterceptors(FileInterceptor('image', {}))
  @ApiConsumes('multipart/form-data')
  @ApiOperation({ summary: 'Update a story by ID' })
  async update(
    @Param('id') id: string,
    @Body() dto: UpdateStoryDto,
    @UploadedFile() image: Express.Multer.File
  ): Promise<Story> {
    const story = await this.storiesService.update(id, dto, image);
    this.logger.debug(
      `Пользователь обновил историю: ${story.title} (ID: ${id})`
    );
    return story;
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a story by ID' })
  async delete(@Param('id') id: string): Promise<void> {
    const story = await this.storiesService.delete(id);
    this.logger.debug(`Пользователь удалил историю: ${id}`);
    return story;
  }
}
