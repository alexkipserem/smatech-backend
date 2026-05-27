import { Controller, Get, Post, Body, Param, Patch, Query, UseGuards, Req } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { PayrollService } from './payroll.service';
import { ProcessPayrollDto } from './dto/process-payroll.dto';
import { UpdatePayrollDto } from './dto/update-payroll.dto';

@Controller('payroll')
@UseGuards(AuthGuard('jwt'))
export class PayrollController {
  constructor(private payrollService: PayrollService) {}

  @Post('process/:employeeId')
  async process(@Req() req: any, @Param('employeeId') employeeId: string, @Body() dto: ProcessPayrollDto) {
    const prisma = this.payrollService['prisma'];
    const firstCompany = await prisma.company.findFirst();
    return this.payrollService.processPayroll(firstCompany?.id || 'comp1', employeeId, dto);
  }

  @Patch(':id/paid')
  async markAsPaid(@Req() req: any, @Param('id') id: string) {
    const prisma = this.payrollService['prisma'];
    const firstCompany = await prisma.company.findFirst();
    return this.payrollService.markAsPaid(firstCompany?.id || 'comp1', id);
  }

  @Get()
  async findAll(@Req() req: any, @Query('year') year?: string, @Query('month') month?: string) {
    const prisma = this.payrollService['prisma'];
    const firstCompany = await prisma.company.findFirst();
    return this.payrollService.findAll(firstCompany?.id || 'comp1', year ? parseInt(year) : undefined, month ? parseInt(month) : undefined);
  }

  @Get(':id')
  async findOne(@Req() req: any, @Param('id') id: string) {
    const prisma = this.payrollService['prisma'];
    const firstCompany = await prisma.company.findFirst();
    return this.payrollService.findOne(firstCompany?.id || 'comp1', id);
  }

  @Patch(':id')
  async update(@Req() req: any, @Param('id') id: string, @Body() dto: UpdatePayrollDto) {
    const prisma = this.payrollService['prisma'];
    const firstCompany = await prisma.company.findFirst();
    return this.payrollService.update(firstCompany?.id || 'comp1', id, dto);
  }
}
