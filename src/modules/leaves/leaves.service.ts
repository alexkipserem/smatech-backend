import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service';
import { CreateLeaveDto } from './dto/create-leave.dto';

@Injectable()
export class LeavesService {
  constructor(private prisma: PrismaService) {}

  async create(companyId: string, employeeId: string, dto: CreateLeaveDto) {
    const startDate = new Date(dto.startDate);
    const endDate = new Date(dto.endDate);

    const overlapping = await this.prisma.leave.findFirst({
      where: {
        employeeId,
        status: { in: ['pending', 'approved'] },
        OR: [{ startDate: { lte: endDate }, endDate: { gte: startDate } }],
      },
    });

    if (overlapping) {
      throw new ConflictException('You have an overlapping leave request');
    }

    return this.prisma.leave.create({
      data: {
        companyId,
        employeeId,
        leaveType: dto.leaveType,
        startDate,
        endDate,
        days: dto.days,
        reason: dto.reason,
        status: 'pending',
      },
      include: { employee: { select: { firstName: true, lastName: true, employeeCode: true } } },
    });
  }

  async findAll(companyId: string, status?: string) {
    const where: any = { companyId, deletedAt: null };
    if (status) where.status = status;
    return this.prisma.leave.findMany({
      where,
      include: { employee: { select: { firstName: true, lastName: true, employeeCode: true } } },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findMyLeaves(companyId: string, employeeId: string) {
    return this.prisma.leave.findMany({
      where: { companyId, employeeId, deletedAt: null },
      include: { employee: { select: { firstName: true, lastName: true, employeeCode: true } } },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findOne(companyId: string, id: string) {
    const leave = await this.prisma.leave.findFirst({
      where: { id, companyId, deletedAt: null },
      include: { employee: { select: { firstName: true, lastName: true, employeeCode: true } } },
    });
    if (!leave) throw new NotFoundException('Leave request not found');
    return leave;
  }

  async approve(companyId: string, id: string, status: string, notes?: string, approvedBy?: string) {
    await this.findOne(companyId, id);
    return this.prisma.leave.update({
      where: { id },
      data: { status, approvedBy, approvedAt: new Date(), notes },
      include: { employee: { select: { firstName: true, lastName: true, email: true } } },
    });
  }

  async getBalance(companyId: string, employeeId: string) {
    const leaves = await this.prisma.leave.findMany({
      where: { companyId, employeeId, status: 'approved', deletedAt: null },
    });
    const totalDaysTaken = leaves.reduce((sum, l) => sum + l.days, 0);
    return {
      annual: { total: 20, used: 0, remaining: 20 },
      sick: { total: 10, used: 0, remaining: 10 },
      casual: { total: 5, used: 0, remaining: 5 },
      totalUsed: totalDaysTaken,
    };
  }
}
