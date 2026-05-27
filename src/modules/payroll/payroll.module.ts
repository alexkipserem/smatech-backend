import { Module } from '@nestjs/common';
import { PayrollService } from './payroll.service';
import { PayrollController } from './payroll.controller';
import { PrismaService } from '../../database/prisma.service';

@Module({
  controllers: [PayrollController],
  providers: [PayrollService, PrismaService],
  exports: [PayrollService],
})
export class PayrollModule {}
