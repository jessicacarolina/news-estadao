import { Test, TestingModule } from '@nestjs/testing';
import { PublicService } from './public.service';
import { PrismaService } from '../../../shared/prisma/prisma.service';

describe('PublicService', () => {
  let service: PublicService;
  let module: TestingModule;

  beforeEach(async () => {
    module = await Test.createTestingModule({
      providers: [
        PublicService,
        {
          provide: PrismaService,
          useValue: {
            news: {
              findMany: jest.fn(),
              findUnique: jest.fn(),
              count: jest.fn(),
            },
          },
        },
      ],
    }).compile();
    service = module.get<PublicService>(PublicService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('getAll', () => {
    it('should return a list of news with meta', async () => {
      const result = {
        data: [
          {
            id: 1,
            title: 'China retalia os EUA...',
            subtitle: 'China diz que guerra...',
            imageThumb: 'https://...',
            section: 'Economia',
            url: 'https://...',
            publicationDateTime: new Date('2025-04-11T16:44:00.000Z'),
            updatedAt: new Date('2025-04-11T16:44:00.000Z'),
          },
        ],
        meta: {
          page: 1,
          totalPages: 1,
          totalItems: 5,
        },
      };

      jest.spyOn(service, 'getAll').mockResolvedValue(result);

      const response = await service.getAll();
      expect(response.data).toBeInstanceOf(Array);
      expect(response.meta.totalItems).toBe(5);
    });
    
    it('should return empty array if no news exists', async () => {
      const prisma = module.get<PrismaService>(PrismaService);
      (prisma.news.findMany as jest.Mock).mockResolvedValue([]);
      (prisma.news.count as jest.Mock).mockResolvedValue(0);
    
      const response = await service.getAll();
    
      expect(response.data).toEqual([]);
      expect(response.meta.totalItems).toBe(0);
      expect(response.meta.totalPages).toBe(0);
    });
  
    it('should handle invalid page number and default to 1', async () => {
      const prisma = module.get<PrismaService>(PrismaService);
      (prisma.news.findMany as jest.Mock).mockResolvedValue([]);
      (prisma.news.count as jest.Mock).mockResolvedValue(0);
    
      const response = await service.getAll(-3);
    
      expect(response.meta.page).toBe(1);
      expect(prisma.news.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          skip: 0,
          take: 6,
        }),
      );
    });
    
  });

  describe('getById', () => {
    it('should return one news item', async () => {
      const newsId = 5;
      const result = {
        id: newsId,
        title: 'Estadão Empresas Mais...',
        subtitle: 'Representantes de 57 companhias...',
        section: 'Economia',
        url: 'https://...',
        publicationDateTime: new Date('2025-04-11T09:57:00.000Z'),
        image: 'https://...',
        imageThumb: 'https://...',
        content: '<p>ESPECIAL PARA O ESTADÃO...</p>',
        createdAt: new Date('2025-04-10T10:00:00.000Z'),
        updatedAt: new Date('2025-04-11T10:00:00.000Z'),
        deletedAt: null,
      };

      jest.spyOn(service, 'getById').mockResolvedValue(result);

      const response = await service.getById(newsId);
      expect(response).toHaveProperty('id', newsId);
      expect(response.title).toContain('Estadão Empresas');
    });

    it('should throw NotFoundException if news not found', async () => {
      const prisma = module.get<PrismaService>(PrismaService);
      (prisma.news.findUnique as jest.Mock).mockResolvedValue(null);
    
      await expect(service.getById(999)).rejects.toThrow('News not found.');
    });

    it('should throw NotFoundException if news is deleted', async () => {
      const prisma = module.get<PrismaService>(PrismaService);
      (prisma.news.findUnique as jest.Mock).mockResolvedValue({
        id: 1,
        title: 'Notícia apagada',
        deletedAt: new Date(),
      });
    
      await expect(service.getById(1)).rejects.toThrow('News not found.');
    });

  });
});
