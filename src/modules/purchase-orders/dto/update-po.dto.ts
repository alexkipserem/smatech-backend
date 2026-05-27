import { IsString, IsOptional, IsNumber, Min, IsDateString } from 'class-validator';

export class UpdatePurchaseOrderDto {
  @IsDateString()
  @IsOptional()
  expectedDate?: string;

  @IsDateString()
  @IsOptional()
  deliveryDate?: string;

  @IsString()
  @IsOptional()
  status?: string;

  @IsNumber()
  @Min(0)
  @IsOptional()
  discount?: number;

  @IsString()
  @IsOptional()
  notes?: string;
}
