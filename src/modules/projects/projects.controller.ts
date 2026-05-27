import { Controller, Get, Post, Body, Param, Put, Delete, Patch, UseGuards, Req } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ProjectsService } from './projects.service';
import { CreateProjectDto } from './dto/create-project.dto';

@Controller('projects')
@UseGuards(AuthGuard('jwt'))
export class ProjectsController {
  constructor(private projectsService: ProjectsService) {}

  @Post()
  async create(@Req() req: any, @Body() dto: CreateProjectDto) {
    const prisma = this.projectsService['prisma'];
    const firstCompany = await prisma.company.findFirst();
    return this.projectsService.create(firstCompany?.id || 'comp1', dto);
  }

  @Get()
  async findAll(@Req() req: any) {
    const prisma = this.projectsService['prisma'];
    const firstCompany = await prisma.company.findFirst();
    return this.projectsService.findAll(firstCompany?.id || 'comp1');
  }

  @Get(':id')
  async findOne(@Req() req: any, @Param('id') id: string) {
    const prisma = this.projectsService['prisma'];
    const firstCompany = await prisma.company.findFirst();
    return this.projectsService.findOne(firstCompany?.id || 'comp1', id);
  }

  @Put(':id')
  async update(@Req() req: any, @Param('id') id: string, @Body() dto: Partial<CreateProjectDto>) {
    const prisma = this.projectsService['prisma'];
    const firstCompany = await prisma.company.findFirst();
    return this.projectsService.update(firstCompany?.id || 'comp1', id, dto);
  }

  @Patch(':id/status')
  async updateStatus(@Req() req: any, @Param('id') id: string, @Body('status') status: string) {
    const prisma = this.projectsService['prisma'];
    const firstCompany = await prisma.company.findFirst();
    return this.projectsService.updateStatus(firstCompany?.id || 'comp1', id, status);
  }

  @Delete(':id')
  async remove(@Req() req: any, @Param('id') id: string) {
    const prisma = this.projectsService['prisma'];
    const firstCompany = await prisma.company.findFirst();
    return this.projectsService.remove(firstCompany?.id || 'comp1', id);
  }
}
