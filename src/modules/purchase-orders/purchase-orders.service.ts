import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service';
import { CreatePurchaseOrderDto } from './dto/create-po.dto';
import { ReceivePurchaseOrderDto } from './dto/receive-po.dto';

@Injectable()
export class PurchaseOrdersService {
  constructor(private prisma: PrismaService) {}

  private async generatePONumber(companyId: string): Promise<string> {
    const count = await this.prisma.purchaseOrder.count({ where: { companyId } });
    const year = new Date().getFullYear();
    const sequential = String(count + 1).padStart(4, '0');
    return `PO-${year}-${sequential}`;
  }

  async create(companyId: string, dto: CreatePurchaseOrderDto) {
    const supplier = await this.prisma.supplier.findFirst({
      where: { id: dto.supplierId, companyId, deletedAt: null },
    });
    if (!supplier) throw new NotFoundException('Supplier not found');

    let subtotal = 0;
    let totalTax = 0;
    const itemsData = [];

    for (const item of dto.items) {
      const itemSubtotal = item.quantity * item.unitPrice;
      const itemDiscount = (itemSubtotal * (item.discount || 0)) / 100;
      const itemTax = ((itemSubtotal - itemDiscount) * (item.tax || 0)) / 100;
      const itemTotal = itemSubtotal - itemDiscount + itemTax;
      subtotal += itemSubtotal;
      totalTax += itemTax;
      itemsData.push({
        productId: item.productId,
        description: item.description,
        quantity: item.quantity,
        unitPrice: item.unitPrice,
        discount: item.discount || 0,
        tax: item.tax || 0,
        total: itemTotal,
      });
    }

    const totalDiscount = (subtotal * (dto.discount || 0)) / 100;
    const total = subtotal - totalDiscount + totalTax;
    const poNumber = await this.generatePONumber(companyId);

    return this.prisma.purchaseOrder.create({
      data: {
        companyId,
        poNumber,
        supplierId: dto.supplierId,
        expectedDate: new Date(dto.expectedDate),
        subtotal,
        tax: totalTax,
        discount: dto.discount || 0,
        total,
        notes: dto.notes,
        status: 'draft',
        items: { create: itemsData },
      },
      include: { supplier: true, items: true },
    });
  }

  async findAll(companyId: string, status?: string) {
    const where: any = { companyId, deletedAt: null };
    if (status) where.status = status;
    return this.prisma.purchaseOrder.findMany({
      where,
      include: { supplier: { select: { name: true, email: true } }, items: true },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findOne(companyId: string, id: string) {
    const po = await this.prisma.purchaseOrder.findFirst({
      where: { id, companyId, deletedAt: null },
      include: { supplier: true, items: { include: { product: true } } },
    });
    if (!po) throw new NotFoundException('Purchase Order not found');
    return po;
  }

  async updateStatus(companyId: string, id: string, status: string) {
    await this.findOne(companyId, id);
    return this.prisma.purchaseOrder.update({ where: { id }, data: { status } });
  }

  async receiveItems(companyId: string, id: string, dto: ReceivePurchaseOrderDto) {
    const po = await this.findOne(companyId, id);
    for (const item of dto.items) {
      const poItem = po.items.find(i => i.id === item.itemId);
      if (poItem) {
        await this.prisma.purchaseOrderItem.update({
          where: { id: item.itemId },
          data: { receivedQty: item.receivedQty },
        });
        if (poItem.productId) {
          const product = await this.prisma.product.findUnique({ where: { id: poItem.productId } });
          if (product) {
            await this.prisma.product.update({
              where: { id: poItem.productId },
              data: { stockQuantity: product.stockQuantity + item.receivedQty },
            });
          }
        }
      }
    }
    const updatedPo = await this.findOne(companyId, id);
    const allReceived = updatedPo.items.every(item => item.receivedQty >= item.quantity);
    return this.prisma.purchaseOrder.update({
      where: { id },
      data: { status: allReceived ? 'received' : 'partially_received', deliveryDate: new Date() },
      include: { supplier: true, items: true },
    });
  }
}
