import { Module } from '@nestjs/common';
import { NewsModule } from './module/news/news.module';

@Module({
  imports: [NewsModule],
})
export class AppModule {}
