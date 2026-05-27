import { IsString, IsNotEmpty, IsDateString, IsOptional, IsNumber, Min } from 'class-validator';

export class CreateLeaveDto {
  @IsString()
  @IsNotEmpty()
  leaveType: string;

  @IsDateString()
  @IsNotEmpty()
  startDate: string;

  @IsDateString()
  @IsNotEmpty()
  endDate: string;

  @IsNumber()
  @Min(0.5)
  days: number;

  @IsString()
  @IsOptional()
  reason?: string;
}
