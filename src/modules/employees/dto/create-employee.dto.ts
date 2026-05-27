import { IsString, IsNotEmpty, IsEmail, IsOptional, IsNumber, Min } from 'class-validator';

export class CreateEmployeeDto {
  @IsString()
  @IsNotEmpty()
  firstName: string;

  @IsString()
  @IsNotEmpty()
  lastName: string;

  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsString()
  @IsOptional()
  phone?: string;

  @IsString()
  @IsOptional()
  position?: string;

  @IsNumber()
  @Min(0)
  @IsOptional()
  salary?: number;

  @IsString()
  @IsOptional()
  hireDate?: string;
}
