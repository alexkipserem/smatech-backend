import { IsString, IsNotEmpty, IsEmail, IsOptional, IsNumber, Min, Max } from 'class-validator';

export class CreateSupplierDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsString()
  @IsOptional()
  phone?: string;

  @IsString()
  @IsOptional()
  address?: string;

  @IsString()
  @IsOptional()
  contactPerson?: string;

  @IsString()
  @IsOptional()
  paymentTerms?: string;

  @IsNumber()
  @IsOptional()
  @Min(1)
  @Max(365)
  leadTime?: number;

  @IsNumber()
  @IsOptional()
  @Min(1)
  @Max(5)
  rating?: number;
}
