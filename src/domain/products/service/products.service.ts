import {
  HttpException,
  HttpStatus,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { Product } from '../repository/product.entity';
import { ContentfulService } from '../../../services/contentful/service/contentful.service';
import { PaginatedProducts } from '../model/paginated.products';

import { Cron } from '@nestjs/schedule';
import { SyncProductsResponse } from '../model/sync-product.model';
import { syncedMessage } from 'src/shared/constant';

@Injectable()
export class ProductsService {
  private readonly _logger = new Logger(ContentfulService.name);
  constructor(
    @InjectRepository(Product)
    private readonly _productsRepository: Repository<Product>,
    private readonly _contentFulService: ContentfulService,
  ) {}

  findAll(): Promise<Product[]> {
    return this._productsRepository.find();
  }

  findOne(id: string): Promise<Product | null> {
    return this._productsRepository.findOneBy({ id });
  }

  async getProducts({
    page = 1,
    name,
    category,
    minPrice,
    maxPrice,
  }): Promise<PaginatedProducts> {
    const take = 5;
    const skip = (page - 1) * take;
    const where: any = { deleted: false };

    if (name) where.name = name;
    if (category) where.category = category;
    if (minPrice || maxPrice) {
      where.price = {};
      if (minPrice) where.price['$gte'] = minPrice;
      if (maxPrice) where.price['$lte'] = maxPrice;
    }

    const [items, total] = await this._productsRepository.findAndCount({
      where,
      take,
      skip,
    });
    return { items, total, page, pageSize: take };
  }

  async deleteProduct(id: string): Promise<void> {
    try {
      const product = await this._productsRepository.findOne({
        where: { id, deleted: false },
      });
      if (!product) throw new NotFoundException('Product not found');
      product.deleted = true;
      await this._productsRepository.save(product);
    } catch (error) {
      throw new Error(error);
    }
  }

  @Cron('0 * * * *') // Every hour
  async syncProducts(): Promise<SyncProductsResponse> {
    try {
      const products = await this._contentFulService.fetchProducts();
      const contentfulIds = products.map((p) => p.contentfulId);

      const existingProducts = await this._productsRepository.find({
        where: { contentfulId: In(contentfulIds) },
      });

      const existingMap = new Map(
        existingProducts.map((product: Product) => [
          product.contentfulId,
          product,
        ]),
      );

      const productsToSave = products
        .filter((product) => !existingMap.has(product.contentfulId))
        .map((product) => ({
          contentfulId: product.contentfulId,
          name: product.name,
          category: product.category,
          price: product.price,
          sku: product.sku,
          brand: product.brand,
          model: product.model,
          color: product.color,
          currency: product.currency,
          stock: product.stock,
        }));

      await this._productsRepository.save(productsToSave);

      this._logger.log(
        `syncProducts completed: ${productsToSave.length} new products inserted.`,
      );

      return {
        inserted: productsToSave.length,
        total: products.length,
        message: syncedMessage,
        success: true,
      };
    } catch (error) {
      this._logger.error('syncProducts failed', error.stack);
      throw new HttpException('Product sync failed', HttpStatus.BAD_GATEWAY);
    }
  }
}
