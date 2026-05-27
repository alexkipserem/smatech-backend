import { Controller, Post, Get, Body, UseGuards, Req } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { AttendanceService } from './attendance.service';
import { ClockInDto } from './dto/clock-in.dto';

@Controller('attendance')
@UseGuards(AuthGuard('jwt'))
export class AttendanceController {
  constructor(private attendanceService: AttendanceService) {}

  @Post('clock-in')
  async clockIn(@Req() req: any, @Body() dto: ClockInDto) {
    const prisma = this.attendanceService['prisma'];
    const firstCompany = await prisma.company.findFirst();
    const companyId = firstCompany?.id || 'comp1';
    const employeeId = 'c82d293a-b30d-4147-9935-16c65d4762af';
    return this.attendanceService.clockIn(companyId, employeeId, dto.notes);
  }

  @Post('clock-out')
  async clockOut(@Req() req: any) {
    const prisma = this.attendanceService['prisma'];
    const firstCompany = await prisma.company.findFirst();
    const companyId = firstCompany?.id || 'comp1';
    const employeeId = 'c82d293a-b30d-4147-9935-16c65d4762af';
    return this.attendanceService.clockOut(companyId, employeeId);
  }

  @Get('today')
  async getToday(@Req() req: any) {
    const prisma = this.attendanceService['prisma'];
    const firstCompany = await prisma.company.findFirst();
    const companyId = firstCompany?.id || 'comp1';
    const employeeId = 'c82d293a-b30d-4147-9935-16c65d4762af';
    return this.attendanceService.getToday(companyId, employeeId);
  }

  @Get('history')
  async getHistory(@Req() req: any) {
    const prisma = this.attendanceService['prisma'];
    const firstCompany = await prisma.company.findFirst();
    const companyId = firstCompany?.id || 'comp1';
    const employeeId = 'c82d293a-b30d-4147-9935-16c65d4762af';
    return this.attendanceService.getHistory(companyId, employeeId);
  }
}
