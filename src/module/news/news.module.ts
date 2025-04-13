import { Module } from '@nestjs/common';
import { AdminService } from './admin/admin.service';
import { AdminController } from './admin/admin.controller';
import { PublicService } from './public/public.service';
import { PublicController } from './public/public.controller';

@Module({
  providers: [AdminService, PublicService],
  controllers: [AdminController, PublicController]
})
export class NewsModule {}
