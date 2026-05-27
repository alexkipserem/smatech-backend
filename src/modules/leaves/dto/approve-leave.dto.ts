import { IsString, IsNotEmpty, IsOptional } from 'class-validator';

export class ApproveLeaveDto {
  @IsString()
  @IsNotEmpty()
  status: string;

  @IsString()
  @IsOptional()
  notes?: string;
}
