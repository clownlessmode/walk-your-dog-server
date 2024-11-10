import {
  IsEmail,
  IsEnum,
  IsOptional,
  IsPhoneNumber,
  IsString,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { role } from 'src/users/enums/role.enum';

export class SignUpDto {
  @ApiProperty({
    example: 'Иван Иванов',
    description: 'Полное имя пользователя',
    required: true,
  })
  @IsString()
  name: string;

  @ApiProperty({
    example: '+79324567890',
    description: 'Номер телефона пользователя',
    required: true,
  })
  @IsPhoneNumber('RU')
  telephone: string;

  @ApiProperty({
    example: 'IvanIvanov1900@rambler.com',
    description: 'Электронная почта пользователя',
    required: true,
  })
  @IsEmail()
  email: string;

  @ApiProperty({
    example: 'Москва',
    description: 'Город проживания пользователя',
    required: true,
  })
  @IsString()
  city: string;

  @ApiProperty({
    example: 'SITTER',
    enum: role,
    description: 'Роль пользователя',
    required: true,
  })
  @IsEnum(role)
  role: role;

  @ApiProperty({
    type: 'string',
    format: 'binary',
    description: 'Изображение для загрузки',
    required: false,
  })
  @IsOptional()
  image: any;

  @ApiProperty({
    nullable: true,
    example: 'XYSZ',
    description: 'Промокод. Может быть null, если не используется',
  })
  @IsString()
  @IsOptional()
  promocode?: string | null;

  @ApiProperty({
    example: '7:00',
    description: 'Время начала в формате HH:MM',
    required: false,
  })
  @IsOptional()
  start?: string;

  @ApiProperty({
    example: '18:00',
    description: 'Время конца в формате HH:MM',
    required: false,
  })
  @IsOptional()
  end?: string;

  @ApiProperty({
    description:
      'Дни недели для повтора напоминания (1 - понедельник, ..., 7 - воскресенье)',
    example: [1, 3, 5],
    type: [Number],
    required: false,
  })
  @IsOptional()
  days?: number[];

  @ApiProperty({
    description:
      'Список идентификаторов типов питомцев, с которыми работает работник',
    example: [
      'e1b2f3d4-5678-9abc-def0-1234567890ab',
      'abc12345-def6-7890-ghij-456klm789nop',
    ],
    type: [String],
    required: false,
  })
  @IsOptional()
  petTypes?: string | string[];

  @ApiProperty({
    description: 'Список идентификаторов сервисов, предоставляемых работником',
    example: [
      'abcd1234-5678-90ef-ghij-1234567890ab',
      '1234abcd-ef56-78gh-ijkl-90mnopqrstuv',
    ],
    type: [String],
    required: false,
  })
  @IsOptional()
  services?: string | string[];
}
