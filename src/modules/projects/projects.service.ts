import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service';
import { CreateProjectDto } from './dto/create-project.dto';

@Injectable()
export class ProjectsService {
  constructor(private prisma: PrismaService) {}

  async create(companyId: string, dto: CreateProjectDto) {
    return this.prisma.project.create({
      data: {
        companyId,
        name: dto.name,
        code: dto.code,
        description: dto.description,
        customerId: dto.customerId,
        startDate: new Date(dto.startDate),
        endDate: dto.endDate ? new Date(dto.endDate) : null,
        budget: dto.budget,
        priority: dto.priority || 'medium',
        status: 'planning',
      },
    });
  }

  async findAll(companyId: string) {
    return this.prisma.project.findMany({
      where: { companyId, deletedAt: null },
      include: { customer: { select: { name: true } } },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findOne(companyId: string, id: string) {
    const project = await this.prisma.project.findFirst({
      where: { id, companyId, deletedAt: null },
      include: { customer: true },
    });
    if (!project) throw new NotFoundException('Project not found');
    return project;
  }

  async update(companyId: string, id: string, dto: Partial<CreateProjectDto>) {
    await this.findOne(companyId, id);
    return this.prisma.project.update({
      where: { id },
      data: {
        name: dto.name,
        description: dto.description,
        endDate: dto.endDate ? new Date(dto.endDate) : undefined,
        budget: dto.budget,
        priority: dto.priority,
      },
    });
  }

  async updateStatus(companyId: string, id: string, status: string) {
    await this.findOne(companyId, id);
    return this.prisma.project.update({ where: { id }, data: { status } });
  }

  async remove(companyId: string, id: string) {
    await this.findOne(companyId, id);
    return this.prisma.project.update({
      where: { id },
      data: { deletedAt: new Date(), isActive: false },
    });
  }
}
