import { IsOptional, IsString } from 'class-validator';

export class ClockInDto {
  @IsString()
  @IsOptional()
  notes?: string;
}
