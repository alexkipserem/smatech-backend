import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service';

@Injectable()
export class AttendanceService {
  constructor(private prisma: PrismaService) {}

  async clockIn(companyId: string, employeeId: string, notes?: string) {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const existing = await this.prisma.attendance.findFirst({
      where: {
        employeeId,
        date: {
          gte: today,
          lt: new Date(today.getTime() + 24 * 60 * 60 * 1000),
        },
      },
    });

    if (existing && existing.clockIn) {
      throw new ConflictException('Already clocked in today');
    }

    if (existing && !existing.clockIn) {
      return this.prisma.attendance.update({
        where: { id: existing.id },
        data: { clockIn: new Date(), notes },
      });
    }

    return this.prisma.attendance.create({
      data: {
        companyId,
        employeeId,
        date: today,
        clockIn: new Date(),
        notes,
        status: 'present',
      },
    });
  }

  async clockOut(companyId: string, employeeId: string) {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const attendance = await this.prisma.attendance.findFirst({
      where: {
        employeeId,
        date: {
          gte: today,
          lt: new Date(today.getTime() + 24 * 60 * 60 * 1000),
        },
      },
    });

    if (!attendance) {
      throw new NotFoundException('No clock in found for today');
    }

    if (attendance.clockOut) {
      throw new ConflictException('Already clocked out today');
    }

    return this.prisma.attendance.update({
      where: { id: attendance.id },
      data: { clockOut: new Date() },
    });
  }

  async getToday(companyId: string, employeeId: string) {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    return this.prisma.attendance.findFirst({
      where: {
        employeeId,
        date: {
          gte: today,
          lt: new Date(today.getTime() + 24 * 60 * 60 * 1000),
        },
      },
    });
  }

  async getHistory(companyId: string, employeeId: string) {
    return this.prisma.attendance.findMany({
      where: { companyId, employeeId },
      orderBy: { date: 'desc' },
      take: 30,
    });
  }
}
