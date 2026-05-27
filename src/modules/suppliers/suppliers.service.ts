import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service';
import { CreateSupplierDto } from './dto/create-supplier.dto';

@Injectable()
export class SuppliersService {
  constructor(private prisma: PrismaService) {}

  async create(companyId: string, dto: CreateSupplierDto) {
    const existing = await this.prisma.supplier.findFirst({
      where: { companyId, email: dto.email, deletedAt: null },
    });
    if (existing) throw new ConflictException('Supplier with this email already exists');

    return this.prisma.supplier.create({
      data: { companyId, ...dto },
    });
  }

  async findAll(companyId: string) {
    return this.prisma.supplier.findMany({
      where: { companyId, deletedAt: null },
      orderBy: { name: 'asc' },
    });
  }

  async findOne(companyId: string, id: string) {
    const supplier = await this.prisma.supplier.findFirst({
      where: { id, companyId, deletedAt: null },
    });
    if (!supplier) throw new NotFoundException('Supplier not found');
    return supplier;
  }

  async update(companyId: string, id: string, dto: Partial<CreateSupplierDto>) {
    await this.findOne(companyId, id);
    return this.prisma.supplier.update({ where: { id }, data: dto });
  }

  async remove(companyId: string, id: string) {
    await this.findOne(companyId, id);
    return this.prisma.supplier.update({
      where: { id },
      data: { deletedAt: new Date(), isActive: false, status: 'inactive' },
    });
  }
}
