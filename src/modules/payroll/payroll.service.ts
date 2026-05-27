import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service';
import { ProcessPayrollDto } from './dto/process-payroll.dto';
import { UpdatePayrollDto } from './dto/update-payroll.dto';

@Injectable()
export class PayrollService {
  constructor(private prisma: PrismaService) {}

  private async getTaxRate(companyId: string): Promise<number> {
    const setting = await this.prisma.setting.findUnique({
      where: { companyId_key: { companyId, key: 'tax_rate' } },
    });
    return setting ? parseFloat(setting.value) : 10;
  }

  private calculateTax(grossSalary: number, taxRate: number): number {
    return (grossSalary * taxRate) / 100;
  }

  async processPayroll(companyId: string, employeeId: string, dto: ProcessPayrollDto) {
    const employee = await this.prisma.employee.findFirst({
      where: { id: employeeId, companyId, deletedAt: null },
    });
    if (!employee) throw new NotFoundException('Employee not found');

    const existing = await this.prisma.payroll.findUnique({
      where: { employeeId_year_month: { employeeId, year: dto.year, month: dto.month } },
    });
    if (existing) throw new ConflictException('Payroll already processed for this month');

    const taxRate = await this.getTaxRate(companyId);
    const basicSalary = employee.salary || 0;
    const bonus = dto.bonus || 0;
    const overtime = dto.overtime || 0;
    const grossSalary = basicSalary + bonus + overtime;
    const tax = this.calculateTax(grossSalary, taxRate);
    const netSalary = grossSalary - tax;

    return this.prisma.payroll.create({
      data: {
        companyId,
        employeeId,
        month: dto.month,
        year: dto.year,
        basicSalary,
        bonus,
        overtime,
        tax,
        netSalary,
        status: 'draft',
        notes: dto.notes,
      },
      include: { employee: { select: { firstName: true, lastName: true, employeeCode: true, position: true } } },
    });
  }

  async markAsPaid(companyId: string, id: string) {
    const payroll = await this.prisma.payroll.findFirst({ where: { id, companyId } });
    if (!payroll) throw new NotFoundException('Payroll record not found');
    return this.prisma.payroll.update({ where: { id }, data: { status: 'paid', paidAt: new Date() } });
  }

  async findAll(companyId: string, year?: number, month?: number) {
    const where: any = { companyId };
    if (year) where.year = year;
    if (month) where.month = month;
    return this.prisma.payroll.findMany({
      where,
      include: { employee: { select: { firstName: true, lastName: true, employeeCode: true, position: true } } },
      orderBy: [{ year: 'desc' }, { month: 'desc' }],
    });
  }

  async findOne(companyId: string, id: string) {
    const payroll = await this.prisma.payroll.findFirst({
      where: { id, companyId },
      include: { employee: { select: { firstName: true, lastName: true, employeeCode: true, position: true, salary: true } } },
    });
    if (!payroll) throw new NotFoundException('Payroll record not found');
    return payroll;
  }

  async update(companyId: string, id: string, dto: UpdatePayrollDto) {
    const payroll = await this.findOne(companyId, id);
    const taxRate = await this.getTaxRate(companyId);
    const bonus = dto.bonus ?? payroll.bonus;
    const overtime = dto.overtime ?? payroll.overtime;
    const grossSalary = payroll.basicSalary + bonus + overtime;
    const tax = this.calculateTax(grossSalary, taxRate);
    const netSalary = grossSalary - tax;
    return this.prisma.payroll.update({ where: { id }, data: { bonus, overtime, tax, netSalary, notes: dto.notes } });
  }
}
