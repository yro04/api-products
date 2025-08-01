import {
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  InternalServerErrorException,
  Logger,
  Query,
  UseGuards,
} from '@nestjs/common';

import { ReportsService } from '../service/report.service';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiQuery,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { ProductRepository } from 'src/domain/products/repository/product.entity';
import { JwtAuthGuard } from '../../../shared/services/auth/jwt-auth.guard';

@ApiTags('Reports')
@ApiBearerAuth()
@Controller('reports')
@UseGuards(JwtAuthGuard)
export class ReportsController {
  private readonly _logger = new Logger(ReportsController.name);
  constructor(private readonly reportsService: ReportsService) {}

  @Get('deleted-percentage')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Report for listing amount of deleted procuts' })
  @ApiResponse({
    status: 200,
    description: 'Report retrieved successfully',
  })
  @ApiResponse({
    status: 500,
    description: 'Internal server error',
  })
  async getDeletedPercentage(): Promise<{ percentage: number }> {
    try {
      return await this.reportsService.getDeletedPercentage();
    } catch (error) {
      this._logger.error('Error in fetching deleted product report:', error);
      throw new InternalServerErrorException('Unable to fetch information');
    }
  }

  @Get('non-deleted-percentage')
  @ApiQuery({ name: 'withPrice', required: false, type: Boolean })
  @ApiQuery({ name: 'startDate', required: false, type: String })
  @ApiQuery({ name: 'endDate', required: false, type: String })
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Report for listing amount of non-deleted procuts' })
  @ApiResponse({
    status: 200,
    description: 'Report retrieved successfully',
  })
  @ApiResponse({
    status: 500,
    description: 'Internal server error',
  })
  async getNonDeletedPercentage(
    @Query('withPrice') withPrice?: boolean,
    @Query('startDate') startDate?: string,
    @Query('endDate') endDate?: string,
  ): Promise<{ percentage: number }> {
    try {
      return await this.reportsService.getNonDeletedPercentage({
        withPrice,
        startDate,
        endDate,
      });
    } catch (error) {
      this._logger.error('Error fetching non deleted products:', error);
      throw new InternalServerErrorException('Unable to fetch information');
    }
  }

  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Report for listing 5 most recent procuts' })
  @ApiResponse({
    status: 200,
    description: 'Report retrieved successfully',
  })
  @ApiResponse({
    status: 500,
    description: 'Internal server error',
  })
  @Get('recent-products')
  async getRecentProducts(): Promise<ProductRepository[]> {
    try {
      return await this.reportsService.getRecentProducts();
    } catch (error) {
      this._logger.error('Error fetching most recent products:', error);
      throw new InternalServerErrorException('Unable to fetch information');
    }
  }
}
