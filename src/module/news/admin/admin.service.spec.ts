import { Test, TestingModule } from '@nestjs/testing';
import { AdminService } from './admin.service';
import { PrismaService } from '../../../shared/prisma/prisma.service';
import { NotFoundException, BadRequestException, HttpException } from '@nestjs/common';
import type { CreateNewsDto } from '../dto/create-news.dto';

describe('AdminService', () => {
  let service: AdminService;
  let prismaService: PrismaService;

  const mockPrismaService = {
    news: {
      create: jest.fn(),
      update: jest.fn(),
      findUnique: jest.fn(),
    },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AdminService,
        {
          provide: PrismaService,
          useValue: mockPrismaService,
        },
      ],
    }).compile();

    service = module.get<AdminService>(AdminService);
    prismaService = module.get<PrismaService>(PrismaService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('createNews', () => {
    it('should create news successfully', async () => {
      const createNewsDtoMock = (): CreateNewsDto => ({ 
        title: 'Um título para a nova notícia',
        subtitle: 'Um subtítulo para a nova notícia',
        section: 'tecnologia',
        url: 'https://exemplo.com/noticia',
        publicationDateTime: new Date('2025-04-18T12:22:00.000Z').toISOString(),
        image: 'https://exemplo.com/imagem.jpg',
        imageThumb: 'https://exemplo.com/thumb.jpg',
        content: 'Conteúdo completo da notícia.',
      });
      const createdNews = { id: 1, ...createNewsDtoMock };
      mockPrismaService.news.create.mockResolvedValue(createdNews);

      const result = await service.createNews(createNewsDtoMock());
      expect(result).toEqual(createdNews);
      expect(mockPrismaService.news.create).toHaveBeenCalledWith({
        data: {
          ...createNewsDtoMock(),
          publicationDateTime: new Date(createNewsDtoMock().publicationDateTime),         
        },
      });
    });

    it('should throw an error if creation fails', async () => {
      const createNewsDtoMock = (): CreateNewsDto => ({ 
        title: 'Um título para a nova notícia',
        subtitle: 'Um subtítulo para a nova notícia',
        section: 'tecnologia',
        url: 'https://exemplo.com/noticia',
        publicationDateTime: new Date('2025-04-18T12:22:00.000Z').toISOString(),
        image: 'https://exemplo.com/imagem.jpg',
        imageThumb: 'https://exemplo.com/thumb.jpg',
        content: 'Conteúdo completo da notícia.',
      });
      mockPrismaService.news.create.mockRejectedValue(new HttpException('Error creating news. Please try again.', 500));
      
      await expect(service.createNews(createNewsDtoMock())).rejects.toThrow(HttpException);
    });
  });

  describe('updateNews', () => {
    it('should update news successfully', async () => {
      const id = 1;
      const updateNewsDto = { title: 'Updated News' };
      const existingNews = { id, title: 'Old News' };
      const updatedNews = { id, ...updateNewsDto };

      mockPrismaService.news.findUnique.mockResolvedValue(existingNews);
      mockPrismaService.news.update.mockResolvedValue(updatedNews);

      const result = await service.updateNews(id, updateNewsDto);
      expect(result).toEqual(updatedNews);
      expect(mockPrismaService.news.findUnique).toHaveBeenCalledWith({ where: { id } });
      expect(mockPrismaService.news.update).toHaveBeenCalledWith({
        where: { id },
        data: updateNewsDto,
      });
    });

    it('should throw NotFoundException if news does not exist', async () => {
      const id = 1;
      const updateNewsDto = { title: 'Updated News' };

      mockPrismaService.news.findUnique.mockResolvedValue(null);

      await expect(service.updateNews(id, updateNewsDto)).rejects.toThrow(NotFoundException);
    });

    it('should throw BadRequestException if no data is provided', async () => {
      const id = 1;
      const updateNewsDto = {};

      mockPrismaService.news.findUnique.mockResolvedValue({ id, title: 'Old News' });
      mockPrismaService.news.create.mockRejectedValue(new HttpException('No data provided to update.', 400));
      await expect(service.updateNews(id, updateNewsDto)).rejects.toThrow(BadRequestException);
    });

    it('should throw an error if update fails', async () => {
      const id = 1;
      const updateNewsDto = { title: 'Updated News' };

      mockPrismaService.news.findUnique.mockResolvedValue({ id, title: 'Old News' });
      mockPrismaService.news.update.mockRejectedValue(new HttpException('Error updating news. Please try again.', 500));

      await expect(service.updateNews(id, updateNewsDto)).rejects.toThrow(HttpException);
    });
  });

  describe('deleteNews', () => {
    it('should delete news successfully', async () => {
      const id = 1;
      const existingNews = { id };
      const deletedNews = { id, deletedAt: new Date() };

      mockPrismaService.news.findUnique.mockResolvedValue(existingNews);
      mockPrismaService.news.update.mockResolvedValue(deletedNews);

      const result = await service.deleteNews(id);
      expect(result).toEqual(deletedNews);
      expect(mockPrismaService.news.findUnique).toHaveBeenCalledWith({ where: { id } });
      expect(mockPrismaService.news.update).toHaveBeenCalledWith({
        where: { id },
        data: { deletedAt: expect.any(Date) },
      });
    });

    it('should throw NotFoundException if news does not exist', async () => {
      const id = 1;

      mockPrismaService.news.findUnique.mockResolvedValue(null);

      await expect(service.deleteNews(id)).rejects.toThrow(NotFoundException);
    });

    it('should throw an error if deletion fails', async () => {
      const id = 1;
      const existingNews = { id };

      mockPrismaService.news.findUnique.mockResolvedValue(existingNews);
      mockPrismaService.news.update.mockRejectedValue(new HttpException('News not found.', 404));

      await expect(service.deleteNews(id)).rejects.toThrow(HttpException);
    });
  });
});
