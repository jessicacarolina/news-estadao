import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { PrismaService } from 'src/shared/prisma/prisma.service';
import { CreateNewsDto } from '../dto/create-news.dto';

@Injectable()
export class AdminService {
  constructor(private readonly prisma: PrismaService) {}

  async createNews(createNewsDto: CreateNewsDto) {
    this.validateCreateNewsDto(createNewsDto);

    const data = {
      ...createNewsDto,
      publicationDateTime: new Date(createNewsDto.publicationDateTime),
    };

    try {
      return await this.prisma.news.create({ data });
    } catch (error) {
      throw new HttpException(
        'Error creating news. Please try again.',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  private validateCreateNewsDto(createNewsDto: CreateNewsDto) {
    const missingFields = Object.entries(createNewsDto)
    .filter(([_, value]) => value === null || value === undefined || value === '')
    .map(([key]) => key);
    if (missingFields.length > 0) {
      throw new HttpException(
        `The following fields are required: ${missingFields.join(', ')}`,
        HttpStatus.BAD_REQUEST,
      );
    }
  }
}