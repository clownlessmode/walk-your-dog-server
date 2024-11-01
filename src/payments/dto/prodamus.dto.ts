import { Type } from 'class-transformer';
import {
  IsString,
  IsNumber,
  IsEnum,
  IsOptional,
  IsArray,
  ValidateNested,
  IsPhoneNumber,
  IsEmail,
  Min,
  IsDateString,
  ArrayMinSize,
  IsPositive,
} from 'class-validator';
import {
  NpdIncomeType,
  PaymentMethod,
  PaymentMethodType,
  PaymentObjectType,
  TaxType,
} from '../types';

export class TaxDto {
  @IsEnum(TaxType)
  tax_type: TaxType;

  @IsOptional()
  @IsNumber()
  @Min(0)
  tax_sum?: number;
}

export class ProductDto {
  @IsOptional()
  @IsString()
  sku?: string;

  @IsString()
  name: string;

  @IsNumber()
  @IsPositive()
  price: number;

  @IsNumber()
  @IsPositive()
  quantity: number;

  @IsOptional()
  @ValidateNested()
  @Type(() => TaxDto)
  tax?: TaxDto;

  @IsOptional()
  @IsEnum(PaymentMethodType)
  paymentMethod?: PaymentMethodType;

  @IsOptional()
  @IsEnum(PaymentObjectType)
  paymentObject?: PaymentObjectType;
}

export class CreatePaymentDto {
  @IsString()
  order_id: string;

  @IsPhoneNumber('RU')
  customer_phone: string;

  @IsEmail()
  customer_email: string;

  @IsArray()
  @ValidateNested({ each: true })
  @ArrayMinSize(1)
  @Type(() => ProductDto)
  products: ProductDto[];

  @IsOptional()
  @IsString()
  subscription?: string;

  @IsOptional()
  @IsNumber()
  vk_user_id?: number;

  @IsOptional()
  @IsString()
  vk_user_name?: string;

  @IsOptional()
  @IsString()
  customer_extra?: string;

  @IsString()
  urlReturn: string;

  @IsString()
  urlSuccess: string;

  @IsOptional()
  @IsString()
  urlNotification?: string;

  @IsOptional()
  @IsString()
  sys?: string;

  @IsOptional()
  @IsEnum(PaymentMethod)
  payment_method?: PaymentMethod;

  @IsOptional()
  @IsNumber()
  @Min(0)
  discount_value?: number;

  @IsOptional()
  @IsEnum(NpdIncomeType)
  npd_income_type?: NpdIncomeType;

  @IsOptional()
  @IsString()
  npd_income_inn?: string;

  @IsOptional()
  @IsString()
  npd_income_company?: string;

  @IsOptional()
  @IsDateString()
  link_expired?: string;

  @IsOptional()
  @IsDateString()
  subscription_date_start?: string;

  @IsOptional()
  @IsString()
  paid_content?: string;
}
