import { Controller, Get, Post, Body, Param, Put, Delete, UseGuards, Req } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ProductsService } from './products.service';
import { CreateProductDto } from './dto/create-product.dto';

@Controller('products')
@UseGuards(AuthGuard('jwt'))
export class ProductsController {
  constructor(private productsService: ProductsService) {}

  @Post()
  async create(@Req() req: any, @Body() dto: CreateProductDto) {
    const prisma = this.productsService['prisma'];
    const firstCompany = await prisma.company.findFirst();
    const companyId = firstCompany?.id || 'temp-company-id';
    return this.productsService.create(companyId, dto);
  }

  @Get()
  async findAll(@Req() req: any) {
    const prisma = this.productsService['prisma'];
    const firstCompany = await prisma.company.findFirst();
    const companyId = firstCompany?.id || 'temp-company-id';
    return this.productsService.findAll(companyId);
  }

  @Get(':id')
  async findOne(@Req() req: any, @Param('id') id: string) {
    const prisma = this.productsService['prisma'];
    const firstCompany = await prisma.company.findFirst();
    const companyId = firstCompany?.id || 'temp-company-id';
    return this.productsService.findOne(companyId, id);
  }

  @Put(':id')
  async update(@Req() req: any, @Param('id') id: string, @Body() dto: Partial<CreateProductDto>) {
    const prisma = this.productsService['prisma'];
    const firstCompany = await prisma.company.findFirst();
    const companyId = firstCompany?.id || 'temp-company-id';
    return this.productsService.update(companyId, id, dto);
  }

  @Delete(':id')
  async remove(@Req() req: any, @Param('id') id: string) {
    const prisma = this.productsService['prisma'];
    const firstCompany = await prisma.company.findFirst();
    const companyId = firstCompany?.id || 'temp-company-id';
    return this.productsService.remove(companyId, id);
  }
}
