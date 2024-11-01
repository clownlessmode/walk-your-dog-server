import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsInt, IsNotEmpty, IsPositive } from 'class-validator';
import { AbonementType } from '../enums/abonementType.enum';

export class CreateAbonementDto {
  @ApiProperty({ example: 'WALKING', enum: AbonementType })
  @IsEnum(AbonementType, {
    message: 'Тип абонемента должен быть одним из допустимых значений',
  })
  @IsNotEmpty({ message: 'Тип абонемента не может быть пустым' })
  abonementType: AbonementType;

  @ApiProperty({ example: 50 })
  @IsInt({ message: 'Общее количество должно быть целым числом' })
  @IsPositive({ message: 'Общее количество должно быть положительным числом' })
  @IsNotEmpty({ message: 'Общее количество не может быть пустым' })
  total: number;

  @ApiProperty({ example: 1990 })
  @IsInt({ message: 'Цена должна быть целым числом' })
  @IsPositive({ message: 'Цена должна быть положительным числом' })
  @IsNotEmpty({ message: 'Цена не может быть пустой' })
  price: number;
}
