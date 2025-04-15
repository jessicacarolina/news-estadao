import { Controller, Get, Param, Query } from '@nestjs/common';
import { PublicService } from './public.service';

@Controller('news')
export class PublicController {
  constructor(private readonly publicService: PublicService) {}

  @Get()
  async getAll(
    @Query('page') page = 1,
  ) {
    return this.publicService.getAll(Number(page));
  }

  @Get(':id')
  async getById(@Param('id') id: string) {
    return this.publicService.getById(Number(id));
  }
}
