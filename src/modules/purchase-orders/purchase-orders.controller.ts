import { Controller, Get, Post, Body, Param, Patch, Query, UseGuards, Req } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { PurchaseOrdersService } from './purchase-orders.service';
import { CreatePurchaseOrderDto } from './dto/create-po.dto';
import { ReceivePurchaseOrderDto } from './dto/receive-po.dto';

@Controller('purchase-orders')
@UseGuards(AuthGuard('jwt'))
export class PurchaseOrdersController {
  constructor(private poService: PurchaseOrdersService) {}

  @Post()
  async create(@Req() req: any, @Body() dto: CreatePurchaseOrderDto) {
    const prisma = this.poService['prisma'];
    const firstCompany = await prisma.company.findFirst();
    return this.poService.create(firstCompany?.id || 'comp1', dto);
  }

  @Get()
  async findAll(@Req() req: any, @Query('status') status?: string) {
    const prisma = this.poService['prisma'];
    const firstCompany = await prisma.company.findFirst();
    return this.poService.findAll(firstCompany?.id || 'comp1', status);
  }

  @Get(':id')
  async findOne(@Req() req: any, @Param('id') id: string) {
    const prisma = this.poService['prisma'];
    const firstCompany = await prisma.company.findFirst();
    return this.poService.findOne(firstCompany?.id || 'comp1', id);
  }

  @Patch(':id/status')
  async updateStatus(@Req() req: any, @Param('id') id: string, @Body('status') status: string) {
    const prisma = this.poService['prisma'];
    const firstCompany = await prisma.company.findFirst();
    return this.poService.updateStatus(firstCompany?.id || 'comp1', id, status);
  }

  @Post(':id/receive')
  async receiveItems(@Req() req: any, @Param('id') id: string, @Body() dto: ReceivePurchaseOrderDto) {
    const prisma = this.poService['prisma'];
    const firstCompany = await prisma.company.findFirst();
    return this.poService.receiveItems(firstCompany?.id || 'comp1', id, dto);
  }
}
