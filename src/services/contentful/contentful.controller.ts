import {
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  InternalServerErrorException,
} from '@nestjs/common';
import { ContentfulService } from './contentful.service';
import { Product } from '../../domain/products/repository/product.entity';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';

@ApiTags('Contentful')
@Controller('contentful')
export class ContentfulController {
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
      throw new InternalServerErrorException(
        'Failed to fetch products from Contentful',
      );
    }
  }
}
