import {
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { ContentfulService } from '../service/contentful.service';
import { Product } from '../../../domain/products/repository/product.entity';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';

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
    type: [Product],
  })
  @ApiResponse({
    status: 502,
    description: 'Failed to fetch products from Contentful',
  })
  async fetchProducts(): Promise<Product[]> {
    try {
      return await this._contentfulService.fetchProducts();
    } catch (error) {
      this._logger.error('Failed to fetch products from Contentful', error.stack);
      throw new InternalServerErrorException(
        'Failed to fetch products from Contentful',
      );
    }
  }
}
