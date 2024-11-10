// src/addresses/dto/UpdateAddress.dto.ts
import { IsOptional, IsString, IsNumber } from 'class-validator';

export class UpdateAddressDto {
  @IsOptional()
  @IsString()
  address?: string;

  @IsOptional()
  @IsNumber()
  lat?: number;

  @IsOptional()
  @IsNumber()
  lon?: number;

  @IsOptional()
  @IsString()
  apartment?: string;

  @IsOptional()
  @IsString()
  doorcode?: string;

  @IsOptional()
  @IsString()
  entrance?: string;
}
