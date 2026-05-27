import { Controller, Get, Post, Body, Param, Put, Delete, UseGuards, Req } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { EmployeesService } from './employees.service';
import { CreateEmployeeDto } from './dto/create-employee.dto';

@Controller('employees')
@UseGuards(AuthGuard('jwt'))
export class EmployeesController {
  constructor(private employeesService: EmployeesService) {}

  @Post()
  async create(@Req() req: any, @Body() dto: CreateEmployeeDto) {
    const prisma = this.employeesService['prisma'];
    const firstCompany = await prisma.company.findFirst();
    const companyId = firstCompany?.id || 'comp1';
    return this.employeesService.create(companyId, dto);
  }

  @Get()
  async findAll(@Req() req: any) {
    const prisma = this.employeesService['prisma'];
    const firstCompany = await prisma.company.findFirst();
    const companyId = firstCompany?.id || 'comp1';
    return this.employeesService.findAll(companyId);
  }

  @Get(':id')
  async findOne(@Req() req: any, @Param('id') id: string) {
    const prisma = this.employeesService['prisma'];
    const firstCompany = await prisma.company.findFirst();
    const companyId = firstCompany?.id || 'comp1';
    return this.employeesService.findOne(companyId, id);
  }

  @Put(':id')
  async update(@Req() req: any, @Param('id') id: string, @Body() dto: Partial<CreateEmployeeDto>) {
    const prisma = this.employeesService['prisma'];
    const firstCompany = await prisma.company.findFirst();
    const companyId = firstCompany?.id || 'comp1';
    return this.employeesService.update(companyId, id, dto);
  }

  @Delete(':id')
  async remove(@Req() req: any, @Param('id') id: string) {
    const prisma = this.employeesService['prisma'];
    const firstCompany = await prisma.company.findFirst();
    const companyId = firstCompany?.id || 'comp1';
    return this.employeesService.remove(companyId, id);
  }
}
