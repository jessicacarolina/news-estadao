import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../../shared/prisma/prisma.service';
import { CreateNewsDto } from '../dto/create-news.dto';
import { UpdateNewsDto } from '../dto/update-news.dto';

@Injectable()
export class AdminService {
  constructor(private readonly prisma: PrismaService) {}

  async createNews(createNewsDto: CreateNewsDto) {
    const data = {
      ...createNewsDto,
      publicationDateTime: new Date(createNewsDto.publicationDateTime),
    };

    try {
      return this.prisma.news.create({ data });
    } catch (error) {
      throw new BadRequestException('Error creating news. Please try again.');
    }
  }

  async updateNews(id: number, updateNewsDto: UpdateNewsDto) {
    const exists = await this.prisma.news.findUnique({ where: { id } });
    if (!exists) {
      throw new NotFoundException('News not found.');
    }
    if (Object.keys(updateNewsDto).length === 0) {
      throw new BadRequestException('No data provided to update.');
    }
    try {
      return this.prisma.news.update({
        where: { id },
        data: updateNewsDto,
      });
    } catch (error) {
      throw new BadRequestException('Error updating news. Please try again.');
    }
  }

}