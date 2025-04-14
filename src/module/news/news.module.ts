import { Module } from '@nestjs/common';
import { AdminService } from './admin/admin.service';
import { AdminController } from './admin/admin.controller';
import { PublicService } from './public/public.service';
import { PublicController } from './public/public.controller';
import { PrismaModule } from 'src/shared/prisma/prisma.module';

@Module({
  imports: [PrismaModule], 
  providers: [AdminService, PublicService],
  controllers: [AdminController, PublicController],
  exports: [AdminService, PublicService],
})
export class NewsModule {}
