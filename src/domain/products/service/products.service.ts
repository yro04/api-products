import {
  BadRequestException,
  HttpException,
  HttpStatus,
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';

import { PaginatedProducts } from '../model/paginated.products';

import { Cron } from '@nestjs/schedule';
import { SyncProductsResponse } from '../model/sync-product.model';
import { syncedMessage } from '../../../shared/constant';
import { ContentfulService } from '../../../shared/services/contentful/service/contentful.service';

import { ProductRepository } from '../repository/product.entity';
import { GetProductsParams } from '../model/product.model';

@Injectable()
export class ProductsService {
  private readonly _logger = new Logger(ProductsService.name);
  constructor(
    @InjectRepository(ProductRepository)
    private readonly _productsRepository: Repository<ProductRepository>,
    private readonly _contentFulService: ContentfulService,
  ) {}

  async getProducts({
    page = 1,
    name,
    category,
    minPrice,
    maxPrice,
  }: GetProductsParams): Promise<PaginatedProducts> {
    const take = 5;
    const skip = (page - 1) * take;

    try {
      const query = this._productsRepository
        .createQueryBuilder('product')
        .where('product.deleted = :deleted', { deleted: false });

      if (page < 1) {
        throw new BadRequestException('Page must be 1 or greater');
      }

      if (name) {
        query.andWhere('product.name ILIKE :name', { name: `%${name}%` });
      }

      if (category) {
        query.andWhere('product.category = :category', { category });
      }

      if (
        minPrice !== undefined &&
        maxPrice !== undefined &&
        minPrice > maxPrice
      ) {
        throw new BadRequestException(
          'minPrice cannot be greater than maxPrice',
        );
      }

      if (minPrice !== undefined && maxPrice !== undefined) {
        query.andWhere('product.price BETWEEN :min AND :max', {
          min: minPrice,
          max: maxPrice,
        });
      } else if (minPrice !== undefined) {
        query.andWhere('product.price >= :min', { min: minPrice });
      } else if (maxPrice !== undefined) {
        query.andWhere('product.price <= :max', { max: maxPrice });
      }

      const [items, total] = await query
        .skip(skip)
        .take(take)
        .getManyAndCount();

      return {
        items,
        total,
        page,
        pageSize: take,
      };
    } catch (error) {
      this._logger.error('Error in getProducts:', error);
      throw new InternalServerErrorException('Failed to retrieve products');
    }
  }

  async deleteProduct(id: string): Promise<void> {
    try {
      const product = await this._productsRepository.findOne({
        where: { id: id, deleted: false },
      });
      if (!product) throw new NotFoundException('Product not found');

      product.deleted = true;
      await this._productsRepository.save(product);

      this._logger.log(`Product ${id} marked as deleted successfully`);
    } catch (error) {
      this._logger.error(`Error while deleting product ${id}:`, error);

      if (error instanceof HttpException) {
        throw error;
      }

      throw new InternalServerErrorException(
        'An unexpected error occurred while deleting the product',
      );
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
        existingProducts.map((product: ProductRepository) => [
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
      this._logger.error('syncProducts failed', error);
      throw new HttpException('Product sync failed', HttpStatus.BAD_GATEWAY);
    }
  }
}
