import { Injectable, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../../../shared/prisma/prisma.service';
import { CreateNewsDto } from '../dto/create-news.dto';

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

}