import { IsString, IsNotEmpty, IsUUID, IsDateString, IsNumber, IsOptional, Min, ArrayMinSize, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

export class PurchaseOrderItemDto {
  @IsString()
  @IsOptional()
  productId?: string;

  @IsString()
  @IsNotEmpty()
  description: string;

  @IsNumber()
  @Min(0.01)
  quantity: number;

  @IsNumber()
  @Min(0)
  unitPrice: number;

  @IsNumber()
  @Min(0)
  @IsOptional()
  discount?: number;

  @IsNumber()
  @Min(0)
  @IsOptional()
  tax?: number;
}

export class CreatePurchaseOrderDto {
  @IsUUID()
  @IsNotEmpty()
  supplierId: string;

  @IsDateString()
  @IsNotEmpty()
  expectedDate: string;

  @ValidateNested({ each: true })
  @ArrayMinSize(1)
  @Type(() => PurchaseOrderItemDto)
  items: PurchaseOrderItemDto[];

  @IsNumber()
  @Min(0)
  @IsOptional()
  discount?: number;

  @IsString()
  @IsOptional()
  notes?: string;
}
