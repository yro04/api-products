import { ProductsService } from './products.service';
import { ProductRepository } from '../repository/product.entity';
import { ContentfulService } from '../../../shared/services/contentful/service/contentful.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Test, TestingModule } from '@nestjs/testing';
import { Repository } from 'typeorm';

describe('ProductsService (Happy Paths)', () => {
  let service: ProductsService;
  let productRepo: jest.Mocked<Repository<ProductRepository>>;
  let contentfulService: jest.Mocked<ContentfulService>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ProductsService,
        {
          provide: getRepositoryToken(ProductRepository),
          useValue: {
            createQueryBuilder: jest.fn().mockReturnValue({
              where: jest.fn().mockReturnThis(),
              andWhere: jest.fn().mockReturnThis(),
              skip: jest.fn().mockReturnThis(),
              take: jest.fn().mockReturnThis(),
              getManyAndCount: jest.fn().mockResolvedValue([[], 0]),
            }),
            findOne: jest.fn().mockResolvedValue({ id: '1', deleted: false }),
            save: jest.fn(),
            find: jest.fn(),
          },
        },
        {
          provide: ContentfulService,
          useValue: {
            fetchProducts: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get(ProductsService);
    productRepo = module.get(getRepositoryToken(ProductRepository));
    contentfulService = module.get(ContentfulService);
  });

    it('should be defined', () => {
    expect(service).toBeDefined();
  });


  it('should sync and insert new products', async () => {
    const mockProducts = [
      {
        contentfulId: 'abc123',
        name: 'Product A',
        category: 'Category A',
        price: 100,
        sku: 'SKU123',
        brand: 'BrandA',
        model: 'ModelX',
        color: 'Red',
        currency: 'USD',
        stock: 5,
      },
    ];

    contentfulService.fetchProducts.mockResolvedValueOnce(mockProducts);
    productRepo.find.mockResolvedValueOnce([]); // No existing products

    await expect(service.syncProducts()).resolves.toEqual({
      inserted: 1,
      total: 1,
      message: expect.any(String),
      success: true,
    });

    expect(productRepo.save).toHaveBeenCalledWith([
      expect.objectContaining({ contentfulId: 'abc123' }),
    ]);
  });
});
