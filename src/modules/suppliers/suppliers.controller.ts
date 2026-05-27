import { Controller, Get, Post, Body, Param, Put, Delete, UseGuards, Req } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { SuppliersService } from './suppliers.service';
import { CreateSupplierDto } from './dto/create-supplier.dto';

@Controller('suppliers')
@UseGuards(AuthGuard('jwt'))
export class SuppliersController {
  constructor(private suppliersService: SuppliersService) {}

  @Post()
  async create(@Req() req: any, @Body() dto: CreateSupplierDto) {
    const prisma = this.suppliersService['prisma'];
    const firstCompany = await prisma.company.findFirst();
    return this.suppliersService.create(firstCompany?.id || 'comp1', dto);
  }

  @Get()
  async findAll(@Req() req: any) {
    const prisma = this.suppliersService['prisma'];
    const firstCompany = await prisma.company.findFirst();
    return this.suppliersService.findAll(firstCompany?.id || 'comp1');
  }

  @Get(':id')
  async findOne(@Req() req: any, @Param('id') id: string) {
    const prisma = this.suppliersService['prisma'];
    const firstCompany = await prisma.company.findFirst();
    return this.suppliersService.findOne(firstCompany?.id || 'comp1', id);
  }

  @Put(':id')
  async update(@Req() req: any, @Param('id') id: string, @Body() dto: Partial<CreateSupplierDto>) {
    const prisma = this.suppliersService['prisma'];
    const firstCompany = await prisma.company.findFirst();
    return this.suppliersService.update(firstCompany?.id || 'comp1', id, dto);
  }

  @Delete(':id')
  async remove(@Req() req: any, @Param('id') id: string) {
    const prisma = this.suppliersService['prisma'];
    const firstCompany = await prisma.company.findFirst();
    return this.suppliersService.remove(firstCompany?.id || 'comp1', id);
  }
}
