import {
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  InternalServerErrorException,
  Logger,
  Param,
  Post,
  Query,
} from '@nestjs/common';
import { ProductsService } from '../service/products.service';
import { Product } from '../repository/product.entity';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { SyncProductsResponse } from '../model/sync-product.model';

@ApiTags('Products')
@Controller('products')
export class ProductsController {
  private readonly _logger = new Logger(ProductsController.name);
  constructor(private readonly _productsService: ProductsService) {}

  @Get()
  getProducts(
    @Query('page') page = 1,
    @Query('name') name?: string,
    @Query('category') category?: string,
    @Query('minPrice') minPrice?: number,
    @Query('maxPrice') maxPrice?: number,
  ) {
    return this._productsService.getProducts({
      page,
      name,
      category,
      minPrice,
      maxPrice,
    });
  }

  @Get('/all')
  findAll(): Promise<Product[]> {
    return this._productsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string): Promise<Product | null> {
    return this._productsService.findOne(id);
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
  async syncProducts(): Promise<SyncProductsResponse>{
    try {
      return await this._productsService.syncProducts();
    } catch (error) {
      this._logger.error('Manual sync failed', error.stack);
       throw new InternalServerErrorException('Failed to sync products');
    }
  }
}
