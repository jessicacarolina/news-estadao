import { Module } from '@nestjs/common';
import { NewsModule } from './module/news/news.module';
import { PrismaModule } from './shared/prisma/prisma.module';

@Module({
  imports: [NewsModule, PrismaModule],
})
export class AppModule {}
