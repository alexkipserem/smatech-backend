import { Controller, Get, Post, Body, UseGuards, Req } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { SettingsService } from './settings.service';

@Controller('settings')
@UseGuards(AuthGuard('jwt'))
export class SettingsController {
  constructor(private settingsService: SettingsService) {}

  @Get()
  async getAll(@Req() req: any) {
    const prisma = this.settingsService['prisma'];
    const firstCompany = await prisma.company.findFirst();
    return this.settingsService.getAll(firstCompany?.id || 'comp1');
  }

  @Post('batch')
  async updateBatch(@Req() req: any, @Body() updates: { key: string; value: string }[]) {
    const prisma = this.settingsService['prisma'];
    const firstCompany = await prisma.company.findFirst();
    return this.settingsService.updateBatch(firstCompany?.id || 'comp1', updates);
  }
}
