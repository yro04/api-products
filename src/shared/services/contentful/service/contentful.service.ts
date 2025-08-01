import { HttpException, HttpStatus, Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { createClient } from 'contentful';
import { ProductRepository } from '../../../../domain/products/repository/product.entity';
import { NA } from '../../../constant';

@Injectable()
export class ContentfulService {
  private readonly _client: ReturnType<typeof createClient>;
  private readonly _logger = new Logger(ContentfulService.name);

  constructor(private readonly _configService: ConfigService) {
    this._client = createClient({
      space: _configService.get('CONTENTFUL_SPACE_ID') || '',
      accessToken: _configService.get('CONTENTFUL_ACCESS_TOKEN') || '',
      environment: _configService.get('CONTENTFUL_ENVIRONMENT'),
    });
  }

  async fetchProducts(): Promise<ProductRepository[]> {
    try {
      const entries = await this._client.getEntries({
        content_type:
          this._configService.get<string>('CONTENTFUL_CONTENT_TYPE') || '',
      });

      return entries.items.map((item) => ({
        contentfulId: item.sys.id,
        name: String(item.fields.name ?? ''),
        category: item.fields.category ? String(item.fields.category) : NA,
        price: item.fields.price ? Number(item.fields.price) : 0,
        sku: item.fields.sku ? String(item.fields.sku) : NA,
        brand: item.fields.brand ? String(item.fields.brand) : NA,
        model: item.fields.model ? String(item.fields.model) : NA,
        color: item.fields.color ? String(item.fields.color) : NA,
        currency: item.fields.currency ? String(item.fields.currency) : NA,
        stock: item.fields.stock ? Number(item.fields.stock) : 0,
      }));
    } catch (error) {
      this._logger.error('Error fetching products from Contentful', error);
      throw new HttpException(
        'Failed to fetch products from Contentful',
        HttpStatus.BAD_GATEWAY,
      );
    }
  }
}
