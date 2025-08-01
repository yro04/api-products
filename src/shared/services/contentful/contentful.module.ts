import { Module } from '@nestjs/common';
import { ContentfulController } from './controller/contentful.controller';
import { ContentfulService } from './service/contentful.service';

@Module({
  imports: [],
  controllers: [ContentfulController],
  providers: [ContentfulService],
  exports: [ContentfulService],
})
export class ContentfulModule {}
