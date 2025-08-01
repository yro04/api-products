import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductRepository } from './repository/product.entity';
import { ProductsController } from './controller/products.controller';
import { ProductsService } from './service/products.service';
import { SharedModule } from '../../shared/shared.module';
@Module({
  imports: [TypeOrmModule.forFeature([ProductRepository]), SharedModule],
  providers: [ProductsService],
  exports: [ProductsService, TypeOrmModule],
  controllers: [ProductsController],
})
export class ProductsModule {}
