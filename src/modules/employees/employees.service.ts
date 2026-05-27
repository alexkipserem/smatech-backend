import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service';
import { CreateEmployeeDto } from './dto/create-employee.dto';

@Injectable()
export class EmployeesService {
  constructor(private prisma: PrismaService) {}

  private async generateEmployeeCode(): Promise<string> {
    const count = await this.prisma.employee.count();
    const sequential = String(count + 1).padStart(4, '0');
    return `EMP${sequential}`;
  }

  async create(companyId: string, dto: CreateEmployeeDto) {
    const employeeCode = await this.generateEmployeeCode();
    return this.prisma.employee.create({
      data: {
        companyId,
        firstName: dto.firstName,
        lastName: dto.lastName,
        email: dto.email,
        phone: dto.phone,
        position: dto.position,
        salary: dto.salary,
        hireDate: dto.hireDate ? new Date(dto.hireDate) : new Date(),
        employeeCode,
        status: 'active',
      },
    });
  }

  async findAll(companyId: string) {
    return this.prisma.employee.findMany({
      where: { companyId, deletedAt: null },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findOne(companyId: string, id: string) {
    const employee = await this.prisma.employee.findFirst({
      where: { id, companyId, deletedAt: null },
    });
    if (!employee) throw new NotFoundException('Employee not found');
    return employee;
  }

  async update(companyId: string, id: string, dto: Partial<CreateEmployeeDto>) {
    await this.findOne(companyId, id);
    return this.prisma.employee.update({
      where: { id },
      data: {
        firstName: dto.firstName,
        lastName: dto.lastName,
        email: dto.email,
        phone: dto.phone,
        position: dto.position,
        salary: dto.salary,
        hireDate: dto.hireDate ? new Date(dto.hireDate) : undefined,
      },
    });
  }

  async remove(companyId: string, id: string) {
    await this.findOne(companyId, id);
    return this.prisma.employee.update({
      where: { id },
      data: { deletedAt: new Date(), status: 'terminated', isActive: false },
    });
  }
}
