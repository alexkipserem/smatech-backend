import { Controller, Get, Post, Body, Param, Patch, Query, UseGuards, Req } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { LeavesService } from './leaves.service';
import { CreateLeaveDto } from './dto/create-leave.dto';
import { ApproveLeaveDto } from './dto/approve-leave.dto';

@Controller('leaves')
@UseGuards(AuthGuard('jwt'))
export class LeavesController {
  constructor(private leavesService: LeavesService) {}

  @Post()
  async create(@Req() req: any, @Body() dto: CreateLeaveDto) {
    const prisma = this.leavesService['prisma'];
    const firstCompany = await prisma.company.findFirst();
    const companyId = firstCompany?.id || 'comp1';
    const employeeId = 'c82d293a-b30d-4147-9935-16c65d4762af';
    return this.leavesService.create(companyId, employeeId, dto);
  }

  @Get()
  async findAll(@Req() req: any, @Query('status') status?: string) {
    const prisma = this.leavesService['prisma'];
    const firstCompany = await prisma.company.findFirst();
    const companyId = firstCompany?.id || 'comp1';
    return this.leavesService.findAll(companyId, status);
  }

  @Get('my')
  async findMyLeaves(@Req() req: any) {
    const prisma = this.leavesService['prisma'];
    const firstCompany = await prisma.company.findFirst();
    const companyId = firstCompany?.id || 'comp1';
    const employeeId = 'c82d293a-b30d-4147-9935-16c65d4762af';
    return this.leavesService.findMyLeaves(companyId, employeeId);
  }

  @Get('balance')
  async getBalance(@Req() req: any) {
    const prisma = this.leavesService['prisma'];
    const firstCompany = await prisma.company.findFirst();
    const companyId = firstCompany?.id || 'comp1';
    const employeeId = 'c82d293a-b30d-4147-9935-16c65d4762af';
    return this.leavesService.getBalance(companyId, employeeId);
  }

  @Get(':id')
  async findOne(@Req() req: any, @Param('id') id: string) {
    const prisma = this.leavesService['prisma'];
    const firstCompany = await prisma.company.findFirst();
    const companyId = firstCompany?.id || 'comp1';
    return this.leavesService.findOne(companyId, id);
  }

  @Patch(':id/status')
  async approve(@Req() req: any, @Param('id') id: string, @Body() dto: ApproveLeaveDto) {
    const prisma = this.leavesService['prisma'];
    const firstCompany = await prisma.company.findFirst();
    const companyId = firstCompany?.id || 'comp1';
    const approvedBy = req.user?.userId;
    return this.leavesService.approve(companyId, id, dto.status, dto.notes, approvedBy);
  }
}
