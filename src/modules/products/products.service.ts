import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service';
import { CreateProductDto } from './dto/create-product.dto';

@Injectable()
export class ProductsService {
  constructor(private prisma: PrismaService) {}

  async create(companyId: string, dto: CreateProductDto) {
    const existing = await this.prisma.product.findFirst({
      where: { sku: dto.sku, deletedAt: null },
    });

    if (existing) {
      throw new ConflictException('Product with this SKU already exists');
    }

    return this.prisma.product.create({
      data: {
        companyId,
        name: dto.name,
        sku: dto.sku,
        barcode: dto.barcode,
        description: dto.description,
        category: dto.category,
        brand: dto.brand,
        unitPrice: dto.unitPrice,
        costPrice: dto.costPrice,
        taxRate: dto.taxRate || 0,
        stockQuantity: dto.stockQuantity || 0,
        reorderPoint: dto.reorderPoint || 0,
        status: 'active',
        isActive: true,
      },
    });
  }

  async findAll(companyId: string) {
    return this.prisma.product.findMany({
      where: { companyId, deletedAt: null },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findOne(companyId: string, id: string) {
    const product = await this.prisma.product.findFirst({
      where: { id, companyId, deletedAt: null },
    });

    if (!product) {
      throw new NotFoundException('Product not found');
    }

    return product;
  }

  async update(companyId: string, id: string, dto: Partial<CreateProductDto>) {
    await this.findOne(companyId, id);

    return this.prisma.product.update({
      where: { id },
      data: {
        name: dto.name,
        sku: dto.sku,
        barcode: dto.barcode,
        description: dto.description,
        category: dto.category,
        brand: dto.brand,
        unitPrice: dto.unitPrice,
        costPrice: dto.costPrice,
        taxRate: dto.taxRate,
        stockQuantity: dto.stockQuantity,
        reorderPoint: dto.reorderPoint,
      },
    });
  }

  async remove(companyId: string, id: string) {
    await this.findOne(companyId, id);

    return this.prisma.product.update({
      where: { id },
      data: {
        deletedAt: new Date(),
        isActive: false,
        status: 'discontinued',
      },
    });
  }
}
