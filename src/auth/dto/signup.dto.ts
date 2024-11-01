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
    required: true,
  })
  @IsString()
  name: string;

  @ApiProperty({
    example: '+71234567890',
    required: true,
  })
  @IsPhoneNumber('RU')
  telephone: string;

  @ApiProperty({
    example: 'IvanIvanov1900@rambler.com',
  })
  @IsEmail()
  email: string;

  @ApiProperty({
    example: 'Москва',
  })
  @IsString()
  city: string;

  @ApiProperty({
    example: 'SITTER | ClIENT | MANAGER | SUPPORT | ADMIN',
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
    description: 'The promotional code. Can be null if not used.',
  })
  @IsString()
  @IsOptional()
  promocode?: string | null;
}
