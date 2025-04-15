import { Test, TestingModule } from '@nestjs/testing';
import { PublicController } from './public.controller';
import { PublicService } from './public.service';
import { NotFoundException } from '@nestjs/common';

describe('PublicController', () => {
  let controller: PublicController;
  let service: PublicService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PublicController],
      providers: [
        {
          provide: PublicService,
          useValue: {
            getAll: jest.fn(),
            getById: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<PublicController>(PublicController);
    service = module.get<PublicService>(PublicService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('getAll', () => {
    it('should return a list of news with meta', async () => {
      const mockResult = {
        data: [
          {
            id: 1,
            title: 'Notícia 1',
            subtitle: 'Subtítulo',
            imageThumb: 'https://...',
            section: 'Economia',
            url: 'https://...',
            publicationDateTime: new Date(),
            updatedAt: new Date(),
          },
        ],
        meta: {
          page: 1,
          totalPages: 1,
          totalItems: 1,
        },
      };

      (service.getAll as jest.Mock).mockResolvedValue(mockResult);

      const result = await controller.getAll(1);
      expect(result).toEqual(mockResult);
      expect(service.getAll).toHaveBeenCalledWith(1);
    });

    it('should return empty list and meta if no news exists', async () => {
      const mockResult = {
        data: [],
        meta: {
          page: 1,
          totalPages: 0,
          totalItems: 0,
        },
      };

      (service.getAll as jest.Mock).mockResolvedValue(mockResult);

      const result = await controller.getAll(1);
      expect(result.data).toEqual([]);
      expect(result.meta.totalItems).toBe(0);
    });

    it('should call service with page = 1 when no page is provided or an invalid number is sent', async () => {
      const mockResult = {
        data: [],
        meta: {
          page: 1,
          totalPages: 0,
          totalItems: 0,
        },
      };

      (service.getAll as jest.Mock).mockResolvedValue(mockResult);

      const result = await controller.getAll(undefined);
      expect(service.getAll).toHaveBeenCalledWith(1);
      expect(result.meta.page).toBe(1);
    });

  });

  describe('getById', () => {
    it('should return a single news item', async () => {
      const newsId = '5';
      const mockItem = {
        id: newsId,
        title: 'Notícia Detalhada',
        subtitle: 'Sub',
        section: 'Mundo',
        url: 'https://...',
        publicationDateTime: new Date(),
        image: 'https://...',
        imageThumb: 'https://...',
        content: '<p>Conteúdo</p>',
        createdAt: new Date(),
        updatedAt: new Date(),
        deletedAt: null,
      };

      (service.getById as jest.Mock).mockResolvedValue(mockItem);

      const result = await controller.getById(newsId);
      expect(result).toEqual(mockItem);
      expect(service.getById).toHaveBeenCalledWith(Number(newsId));
    });

    it('should throw NotFoundException if news is not found', async () => {
      const newsId = '999';

      (service.getById as jest.Mock).mockRejectedValue(new NotFoundException('News not found.'));

      await expect(controller.getById(newsId)).rejects.toThrow(NotFoundException);
      expect(service.getById).toHaveBeenCalledWith(Number(newsId));
    });

  });
});
