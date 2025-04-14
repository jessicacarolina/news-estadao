import { Test, TestingModule } from '@nestjs/testing';
import { AdminController } from './admin.controller';
import { AdminService } from './admin.service';
import { CreateNewsDto } from '../dto/create-news.dto';
import { UpdateNewsDto } from '../dto/update-news.dto';

describe('AdminController', () => {
  let controller: AdminController;
  let adminService: AdminService;

  const mockAdminService = {
    createNews: jest.fn(),
    updateNews: jest.fn(),
    deleteNews: jest.fn(),
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
        expect(error.response.message).toContain('The following fields are required: title');
      }
    });
  });

  describe('update', () => {
    it('should return success message and data', async () => {
      const id = 1;
      const dto: UpdateNewsDto = { title: 'Updated title', content: 'Updated content' };
      const updated = { id, ...dto };

      mockAdminService.updateNews.mockResolvedValue(updated);

      const result = await controller.update(id, dto);

      expect(result).toEqual({
        message: 'News updated successfully.',
        data: updated,
      });

      expect(mockAdminService.updateNews).toHaveBeenCalledWith(id, dto);
    });

    it('should return error if id does not exist', async () => {
      const id = 999;
      const dto: UpdateNewsDto = { title: 'Updated title', content: 'Updated content' };
  
      mockAdminService.updateNews.mockResolvedValue(null);
  
      try {
        await controller.update(id, dto);
      } catch (error) {
        expect(error.status).toBe(404);
        expect(error.response.message).toContain('News not found');
      }
    });
  
    it('should return error if no data is provided to update', async () => {
      const id = 1;
      const dto: UpdateNewsDto = {};
  
      try {
        await controller.update(id, dto);
      } catch (error) {
        expect(error.status).toBe(400);
        expect(error.response.message).toContain('No data provided to update');
      }
    });
  
  });

  describe('delete', () => {
    it('should return success message when news is deleted', async () => {
      const id = 1;
      mockAdminService.deleteNews.mockResolvedValue({ id });
      const result = await controller.delete(id);
  
      expect(result).toEqual({
        message: 'News deleted successfully.',
        data: { id },
      });
  
      expect(mockAdminService.deleteNews).toHaveBeenCalledWith(id);
    });
  
    it('should return error if id does not exist', async () => {
      const id = 999;
      mockAdminService.deleteNews.mockResolvedValue(null);
  
      try {
        await controller.delete(id);
      } catch (error) {
        expect(error.status).toBe(404);
        expect(error.response.message).toContain('News not found');
      }
  
      expect(mockAdminService.deleteNews).toHaveBeenCalledWith(id);
    });

  });
});
