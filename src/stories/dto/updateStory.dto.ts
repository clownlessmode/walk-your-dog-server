import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

export class UpdateStoryDto {
  @ApiProperty({ example: 'Как подружить кота с собакой?' })
  @IsString({ message: 'Заголовок истории должен быть строкой' })
  @IsOptional()
  title?: string;

  @ApiProperty({
    example:
      'Знакомьте питомцев постепенно, обеспечивая безопасность и поощряя позитивное взаимодействие, пока они не привыкнут друг к другу.',
  })
  @IsString({ message: 'Описание истории должно быть строкой' })
  @IsOptional()
  description?: string;

  @ApiProperty({
    type: 'string',
    format: 'binary',
    required: false,
  })
  @IsOptional()
  image?: any;
}
