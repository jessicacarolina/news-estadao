import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../../shared/prisma/prisma.service';

@Injectable()
export class PublicService {
  constructor(private readonly prisma: PrismaService) {}

  async getAll(page: number = 1) {
    if (!Number.isInteger(page) || page < 1) {
      page = 1;
    }
    const pageSize = 6;
    const skip = (page - 1) * pageSize;

    const news = await this.prisma.news.findMany({
      skip,
      take: pageSize,
      where: {
        deletedAt: null,
      },
      orderBy: {
        updatedAt: 'desc',
      },
      select: {
        id: true,
        title: true,
        subtitle: true,
        imageThumb: true,
        section: true,
        url: true,
        publicationDateTime: true,
        updatedAt: true,
      },
    });

    const total = await this.prisma.news.count({
      where: {
        deletedAt: null,
      },
    });

    return {
      data: news,
      meta: {
        page,
        totalPages: Math.ceil(total / pageSize),
        totalItems: total,
      },
    };
  }

  async getById(id: number) {
    const news = await this.prisma.news.findUnique({
      where: { id },
    });

    if (!news || news.deletedAt) {
      throw new NotFoundException('News not found.');
    }

    return news;
  }
}
