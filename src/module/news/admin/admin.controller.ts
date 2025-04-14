import { Controller, Post, Body } from '@nestjs/common';
import { AdminService } from './admin.service';
import { CreateNewsDto } from '../dto/create-news.dto';

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

}
