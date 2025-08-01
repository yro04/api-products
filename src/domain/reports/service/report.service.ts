import {
  HttpException,
  HttpStatus,
  Injectable,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { ProductRepository } from '../../products/repository/product.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { GetNonDeletedPercentageOptions } from '../model/non-deleted.model';

@Injectable()
export class ReportsService {
  private readonly _logger = new Logger(ReportsService.name);

  constructor(
    @InjectRepository(ProductRepository)
    private readonly _productsRepository: Repository<ProductRepository>,
  ) {}

  async getDeletedPercentage(): Promise<{ percentage: number }> {
    try {
      const totalProducts = await this._productsRepository.count();
      const deletedProducts = await this._productsRepository.count({
        where: { deleted: true },
      });

      const percentage =
        totalProducts > 0 ? (deletedProducts / totalProducts) * 100 : 0;

      return { percentage: Number(percentage.toFixed(2)) };
    } catch (error) {
      this._logger.error('Failed to calculate deleted percentage:', error);
      throw new HttpException(
        'Could not calculate deleted percentage',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async getNonDeletedPercentage({
    withPrice,
    startDate,
    endDate,
  }: GetNonDeletedPercentageOptions): Promise<{ percentage: number }> {
    try {
      const query = this._productsRepository
        .createQueryBuilder('product')
        .where('product.deleted = false');

      if (withPrice !== undefined) {
        query.andWhere(
          withPrice ? 'product.price IS NOT NULL' : 'product.price IS NULL',
        );
      }

      if (startDate && endDate) {
        query.andWhere('product.createdAt BETWEEN :start AND :end', {
          start: new Date(startDate),
          end: new Date(endDate),
        });
      }

      const nonDeletedCount = await query.getCount();

      const totalProducts = await this._productsRepository.count();

      const percentageNonDeleted =
        totalProducts > 0 ? (nonDeletedCount / totalProducts) * 100 : 0;

      return { percentage: Number(percentageNonDeleted.toFixed(2)) };
    } catch (error) {
      this._logger.error('Error fetching non deleted report products:', error);
      throw new InternalServerErrorException(
        'Unable to calculate non-deleted percentage',
      );
    }
  }

  async getRecentProducts(): Promise<ProductRepository[]> {
    try {
      return await this._productsRepository.find({
        where: { deleted: false },
        order: { createdAt: 'DESC' },
        take: 5,
      });
    } catch (error) {
      this._logger.error('Error in getNonDeletedPercentage:', error);
      throw new InternalServerErrorException('Unable to fetch recent products');
    }
  }
}
