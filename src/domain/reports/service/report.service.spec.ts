import { Test, TestingModule } from '@nestjs/testing';

import { Repository } from 'typeorm';
import { ProductRepository } from '../../products/repository/product.entity';
import { getRepositoryToken } from '@nestjs/typeorm';
import { ReportsService } from './report.service';


describe('ReportsService', () => {
  let service: ReportsService;
  let repo: Repository<ProductRepository>;

  const mockRepository = {
    count: jest.fn(),
    createQueryBuilder: jest.fn(),
    find: jest.fn(),
  };

  const mockQueryBuilder = {
    where: jest.fn().mockReturnThis(),
    andWhere: jest.fn().mockReturnThis(),
    getCount: jest.fn(),
  };

  beforeEach(async () => {
    mockRepository.createQueryBuilder.mockReturnValue(mockQueryBuilder);

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ReportsService,
        {
          provide: getRepositoryToken(ProductRepository),
          useValue: mockRepository,
        },
      ],
    }).compile();

    service = module.get<ReportsService>(ReportsService);
    repo = module.get<Repository<ProductRepository>>(getRepositoryToken(ProductRepository));

    jest.clearAllMocks();
  });

  it('getDeletedPercentage returns correct percentage', async () => {
    mockRepository.count
      .mockResolvedValueOnce(10) // total products
      .mockResolvedValueOnce(3); // deleted products

    const result = await service.getDeletedPercentage();
    expect(result).toEqual({ percentage: 30.0 });
  });

  it('getNonDeletedPercentage returns correct percentage', async () => {
    mockQueryBuilder.getCount.mockResolvedValue(7);
    mockRepository.count.mockResolvedValue(10);

    const result = await service.getNonDeletedPercentage({});

    expect(result).toEqual({ percentage: 70.0 });
  });

  it('getRecentProducts returns products array', async () => {
    const mockProducts = [{ id: 1 }, { id: 2 }];
    mockRepository.find.mockResolvedValue(mockProducts);

    const result = await service.getRecentProducts();

    expect(result).toEqual(mockProducts);
    expect(mockRepository.find).toHaveBeenCalledWith({
      where: { deleted: false },
      order: { createdAt: 'DESC' },
      take: 5,
    });
  });
});
