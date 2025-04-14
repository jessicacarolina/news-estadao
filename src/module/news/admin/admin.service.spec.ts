import { Test, TestingModule } from '@nestjs/testing';
import { AdminService } from './admin.service';
import { PrismaService } from '../../../shared/prisma/prisma.service';
import { HttpException } from '@nestjs/common';
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

});
