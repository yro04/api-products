import {
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { ContentfulService } from '../service/contentful.service';

import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { ProductRepository } from '../../../../domain/products/repository/product.entity';

@ApiTags('Contentful')
@Controller('contentful')
export class ContentfulController {
  private readonly _logger = new Logger(ContentfulController.name);
  constructor(private readonly _contentfulService: ContentfulService) {}

  @Get('products')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Fetch products from Contentful' })
  @ApiResponse({
    status: 200,
    description: 'Products successfully retrieved',
    type: [ProductRepository],
  })
  @ApiResponse({
    status: 500,
    description: 'Failed to fetch products from Contentful',
  })
  async fetchProducts(): Promise<ProductRepository[]> {
    try {
      return await this._contentfulService.fetchProducts();
    } catch (error) {
      this._logger.error('Failed to fetch products from Contentful', error);
      throw new InternalServerErrorException(
        'Failed to fetch products from Contentful',
      );
    }
  }
}
