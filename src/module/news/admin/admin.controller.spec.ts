import { Test, TestingModule } from '@nestjs/testing';
import { AdminController } from './admin.controller';
import { AdminService } from './admin.service';
import { CreateNewsDto } from '../dto/create-news.dto';

describe('AdminController', () => {
  let controller: AdminController;
  let adminService: AdminService;

  const mockAdminService = {
    createNews: jest.fn(),
    updateNews: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AdminController],
      providers: [
        {
          provide: AdminService,
          useValue: mockAdminService,
        },
      ]
    }).compile();

    controller = module.get<AdminController>(AdminController);
    adminService = module.get<AdminService>(AdminService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('createNews', () => {
    it('should return success message and data', async () => {
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
      const created = { id: 1, ...createNewsDtoMock };

      mockAdminService.createNews.mockResolvedValue(created);

      const result = await controller.createNews(createNewsDtoMock());

      expect(result).toEqual({
        message: 'News created successfully.',
        data: created,
      });

      expect(mockAdminService.createNews).toHaveBeenCalledWith(createNewsDtoMock());
    });

    it('should return error if required fields are missing', async () => {
      const invalidDto = { title: '', subtitle: '' };
      try {
        await controller.createNews(invalidDto as any);
      } catch (error) {
        expect(error.status).toBe(400);
        expect(error.response.message).toContain('title should not be empty');
      }
    });
  });

});
