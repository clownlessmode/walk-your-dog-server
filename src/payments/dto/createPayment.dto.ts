// import {
//   IsNotEmpty,
//   IsString,
//   IsNumber,
//   IsOptional,
//   IsPhoneNumber,
//   Min,
//   MaxLength,
// } from 'class-validator';
// import { ApiProperty } from '@nestjs/swagger';

// export class CreatePaymentDto {
//   @ApiProperty({
//     example: '12345',
//     description: 'Уникальный идентификатор заказа в вашей системе',
//   })
//   @IsNotEmpty()
//   @IsString()
//   @MaxLength(50)
//   orderId: string;

//   @ApiProperty({
//     example: '+79998887755',
//     description: 'Номер телефона клиента для связи и идентификации',
//   })
//   @IsNotEmpty()
//   @IsPhoneNumber(null, { message: 'Некорректный номер телефона' })
//   customerPhone: string;

//   @ApiProperty({
//     example: 'Подписка на сервис',
//     description: 'Название или описание товара, который покупает клиент',
//   })
//   @IsNotEmpty()
//   @IsString()
//   @MaxLength(100)
//   productName: string;

//   @ApiProperty({
//     example: 2000,
//     description: 'Цена товара или услуги в рублях',
//   })
//   @IsNotEmpty()
//   @IsNumber()
//   @Min(1)
//   price: number;

//   @ApiProperty({
//     example: 1,
//     description: 'Количество единиц товара',
//   })
//   @IsNotEmpty()
//   @IsNumber()
//   @Min(1)
//   quantity: number;

//   @ApiProperty({
//     example: 'Дополнительная информация по заказу',
//     description: 'Дополнительные данные или комментарии для клиента',
//     required: false,
//   })
//   @IsOptional()
//   @IsString()
//   customerExtra?: string;

//   @ApiProperty({
//     example: '2024-12-31 23:59',
//     description: 'Срок действия ссылки на оплату в формате "гггг-мм-дд чч:мм"',
//     required: false,
//   })
//   @IsOptional()
//   @IsString()
//   linkExpired?: string;
// }
