import { ApiProperty } from '@nestjs/swagger';
import { DefaultEntity } from 'src/common/default.entity';
import { Column, Entity } from 'typeorm';

@Entity()
export class Story extends DefaultEntity {
  @Column()
  @ApiProperty({ example: 'Как подружить кота с собакой?' })
  title: string;

  @Column()
  @ApiProperty({
    example:
      'Знакомьте питомцев постепенно, обеспечивая безопасность и поощряя позитивное взаимодействие, пока они не привыкнут друг к другу.',
  })
  description: string;

  @Column()
  @ApiProperty({ example: 'https://i.ibb.co/GcmVjKd/placeholder-light.png' })
  image: string;
}
