import {
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  InternalServerErrorException,
  Logger,
  NotFoundException,
  Param,
  ParseUUIDPipe,
  Post,
  Query,
} from '@nestjs/common';
import { ProductsService } from '../service/products.service';
import {
  ApiBadRequestResponse,
  ApiOperation,
  ApiParam,
  ApiQuery,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { SyncProductsResponse } from '../model/sync-product.model';
import { PaginatedProducts } from '../model/paginated.products';

@ApiTags('Products')
@Controller('products')
export class ProductsController {
  private readonly _logger = new Logger(ProductsController.name);
  constructor(private readonly _productsService: ProductsService) {}

  @Get()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Filtered and paginated products' })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'name', required: false, type: String })
  @ApiQuery({ name: 'category', required: false, type: String })
  @ApiQuery({ name: 'minPrice', required: false, type: Number })
  @ApiQuery({ name: 'maxPrice', required: false, type: Number })
  @ApiBadRequestResponse({ description: 'Invalid query parameters' })
  @ApiResponse({
    status: 200,
    description: 'List of filtered products retrieved successfully',
  })
  @ApiResponse({
    status: 500,
    description: 'Internal server error',
  })
  getProducts(
    @Query('page') page = 1,
    @Query('name') name?: string,
    @Query('category') category?: string,
    @Query('minPrice') minPrice?: number,
    @Query('maxPrice') maxPrice?: number,
  ): Promise<PaginatedProducts> {
    try {
      return this._productsService.getProducts({
        page,
        name,
        category,
        minPrice,
        maxPrice,
      });
    } catch (error) {
      this._logger.error('Failed to fetch filtered products', error);
      throw new InternalServerErrorException('Failed to fetch products');
    }
  }

  @Post()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Manually trigger Contentful product sync' })
  @ApiResponse({
    status: 200,
    description: 'Sync triggered successfully',
  })
  @ApiResponse({
    status: 500,
    description: 'Failed to sync products',
  })
  async syncProducts(): Promise<SyncProductsResponse> {
    try {
      return await this._productsService.syncProducts();
    } catch (error) {
      this._logger.error('Manual sync failed', error);
      throw new InternalServerErrorException('Failed to sync products');
    }
  }

  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Soft delete product from DB' })
  @ApiParam({ name: 'id', type: String, description: 'Product ID (UUID)' })
  @ApiResponse({ status: 200, description: 'Product deleted successfully' })
  @ApiResponse({ status: 404, description: 'Product not found' })
  @ApiResponse({ status: 500, description: 'Internal server error' })
  async deleteProduct(@Param('id', ParseUUIDPipe) id: string) {
    try {
      await this._productsService.deleteProduct(id);
      return { message: 'Product deleted successfully' };
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      this._logger.error('Failed to delete product', error);
      throw new InternalServerErrorException('Failed to delete product');
    }
  }
}
