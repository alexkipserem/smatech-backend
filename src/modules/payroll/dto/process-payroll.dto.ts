import { IsNumber, IsInt, Min, Max, IsOptional, IsString } from 'class-validator';

export class ProcessPayrollDto {
  @IsInt()
  @Min(1)
  @Max(12)
  month: number;

  @IsInt()
  @Min(2020)
  @Max(2030)
  year: number;

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
