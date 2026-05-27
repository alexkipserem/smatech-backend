import { IsNumber, IsOptional, IsString } from 'class-validator';

export class UpdatePayrollDto {
  @IsNumber()
  @IsOptional()
  bonus?: number;

  @IsNumber()
  @IsOptional()
  overtime?: number;

  @IsString()
  @IsOptional()
  notes?: string;
}
