import { Test, TestingModule } from '@nestjs/testing';
import { ProductsController } from './products.controller';
import { ProductsService } from '../service/products.service';

describe('ProductsController', () => {
  let controller: ProductsController;
  let service: ProductsService;

  const mockProductsService = {
    getProducts: jest.fn(),
    syncProducts: jest.fn(),
    deleteProduct: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ProductsController],
      providers: [
        {
          provide: ProductsService,
          useValue: mockProductsService,
        },
      ],
    }).compile();

    controller = module.get<ProductsController>(ProductsController);
    service = module.get<ProductsService>(ProductsService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should delete product (deleteProduct)', async () => {
    const productId = '123e4567-e89b-12d3-a456-426614174000';
    mockProductsService.deleteProduct.mockResolvedValue(undefined);

    const result = await controller.deleteProduct(productId);
    expect(result).toEqual({ message: 'Product deleted successfully' });
    expect(() => service.deleteProduct(productId)).not.toThrow();
  });
});
