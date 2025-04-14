import { Controller, Post, Body, Put, Param, ParseIntPipe, Delete } from '@nestjs/common';
import { AdminService } from './admin.service';
import { CreateNewsDto } from '../dto/create-news.dto';
import { UpdateNewsDto } from '../dto/update-news.dto';

@Controller('admin/news')
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  @Post()
  async createNews(@Body() createNewsDto: CreateNewsDto) {
    const created = await this.adminService.createNews(createNewsDto);
    return {
      message: 'News created successfully.',
      data: created,
    };
  }

  @Put(':id')
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateNewsDto: UpdateNewsDto,
  ) {
    const updated = await this.adminService.updateNews(id, updateNewsDto);
    return {
      message: 'News updated successfully.',
      data: updated,
    };
  }

  @Delete(':id')
  async delete(@Param('id', ParseIntPipe) id: number) {
    const deleted = await this.adminService.deleteNews(id);
    return {
      message: 'News deleted successfully.',
      data: deleted,
    };
  }

}
