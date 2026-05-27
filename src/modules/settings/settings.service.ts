import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service';

@Injectable()
export class SettingsService {
  constructor(private prisma: PrismaService) {}

  async getAll(companyId: string) {
    return this.prisma.setting.findMany({ where: { companyId, isActive: true } });
  }

  async updateBatch(companyId: string, updates: { key: string; value: string }[]) {
    const results = [];
    for (const update of updates) {
      const result = await this.prisma.setting.upsert({
        where: { companyId_key: { companyId, key: update.key } },
        update: { value: update.value },
        create: { companyId, key: update.key, value: update.value, type: 'string', group: 'general' },
      });
      results.push(result);
    }
    return results;
  }
}
