import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Product } from './repository/product.entity';
import { ProductsController } from './controller/products.controller';
import { ProductsService } from './service/products.service';
import { ContentfulService } from '../../services/contentful/service/contentful.service';

@Module({
  imports:[TypeOrmModule.forFeature([Product])],
  providers: [ProductsService, ContentfulService],
  exports: [ProductsService],
  controllers: [ProductsController],
})
export class ProductsModule {}
