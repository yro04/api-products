import { Test, TestingModule } from '@nestjs/testing';
import { ReportsController } from './reports.controller';
import { ReportsService } from '../service/report.service';

describe('ReportsController', () => {
  let controller: ReportsController;
  let service: ReportsService;

  const mockReportsService = {
    getDeletedPercentage: jest.fn(),
    getNonDeletedPercentage: jest.fn(),
    getRecentProducts: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ReportsController],
      providers: [{ provide: ReportsService, useValue: mockReportsService }],
    }).compile();

    controller = module.get<ReportsController>(ReportsController);
    service = module.get<ReportsService>(ReportsService);

    jest.clearAllMocks();
  });

  it('getDeletedPercentage should return percentage from service', async () => {
    mockReportsService.getDeletedPercentage.mockResolvedValue({
      percentage: 42,
    });

    const result = await controller.getDeletedPercentage();

    expect(service.getDeletedPercentage).toHaveBeenCalled();
    expect(result).toEqual({ percentage: 42 });
  });

  it('getNonDeletedPercentage should call service with correct query params and return percentage', async () => {
    mockReportsService.getNonDeletedPercentage.mockResolvedValue({
      percentage: 75,
    });

    const result = await controller.getNonDeletedPercentage(
      true,
      '2023-01-01',
      '2023-01-31',
    );

    expect(service.getNonDeletedPercentage).toHaveBeenCalledWith({
      withPrice: true,
      startDate: '2023-01-01',
      endDate: '2023-01-31',
    });
    expect(result).toEqual({ percentage: 75 });
  });

  it('getRecentProducts should return recent products from service', async () => {
    const mockProducts = [
      { id: 1, name: 'Prod 1' },
      { id: 2, name: 'Prod 2' },
    ];
    mockReportsService.getRecentProducts.mockResolvedValue(mockProducts);

    const result = await controller.getRecentProducts();

    expect(service.getRecentProducts).toHaveBeenCalled();
    expect(result).toEqual(mockProducts);
  });
});
