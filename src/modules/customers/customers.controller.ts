import { Controller, Get, Post, Body, UseGuards, Req } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { CustomersService } from './customers.service';
import { CreateCustomerDto } from './dto/create-customer.dto';

@Controller('customers')
@UseGuards(AuthGuard('jwt'))
export class CustomersController {
  constructor(private customersService: CustomersService) {}

  @Post()
  async create(@Req() req: any, @Body() dto: CreateCustomerDto) {
    const prisma = this.customersService['prisma'];
    const firstCompany = await prisma.company.findFirst();
    const companyId = firstCompany?.id || 'comp1';
    return this.customersService.create(companyId, dto);
  }

  @Get()
  async findAll(@Req() req: any) {
    const prisma = this.customersService['prisma'];
    const firstCompany = await prisma.company.findFirst();
    const companyId = firstCompany?.id || 'comp1';
    return this.customersService.findAll(companyId);
  }
}
