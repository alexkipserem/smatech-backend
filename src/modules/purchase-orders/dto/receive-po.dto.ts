import { IsString, IsNotEmpty, IsNumber, Min, ValidateNested, ArrayMinSize } from 'class-validator';
import { Type } from 'class-transformer';

export class ReceiveItemDto {
  @IsString()
  @IsNotEmpty()
  itemId: string;

  @IsNumber()
  @Min(0)
  receivedQty: number;
}

export class ReceivePurchaseOrderDto {
  @ValidateNested({ each: true })
  @ArrayMinSize(1)
  @Type(() => ReceiveItemDto)
  items: ReceiveItemDto[];
}
