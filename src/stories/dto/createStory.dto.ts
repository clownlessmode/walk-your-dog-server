import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class CreateStoryDto {
  @ApiProperty({ example: 'Как подружить кота с собакой?' })
  @IsString()
  title: string;

  @ApiProperty({
    example:
      'Знакомьте питомцев постепенно, обеспечивая безопасность и поощряя позитивное взаимодействие, пока они не привыкнут друг к другу.',
  })
  @IsString()
  description: string;

  @ApiProperty({
    type: 'string',
    format: 'binary',
    description: 'Изображение для загрузки',
  })
  image: any;
}
