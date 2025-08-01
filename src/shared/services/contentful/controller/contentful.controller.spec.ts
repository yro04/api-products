import { Test, TestingModule } from '@nestjs/testing';
import { ContentfulController } from './contentful.controller';
import { ContentfulService } from '../service/contentful.service';
import { InternalServerErrorException, Logger } from '@nestjs/common';

describe('ContentfulController', () => {
  let controller: ContentfulController;
  let contentfulService: ContentfulService;

  const mockContentfulService = {
    fetchProducts: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ContentfulController],
      providers: [
        {
          provide: ContentfulService,
          useValue: mockContentfulService,
        },
      ],
    }).compile();

    controller = module.get<ContentfulController>(ContentfulController);
    contentfulService = module.get<ContentfulService>(ContentfulService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should throw InternalServerErrorException on service failure', async () => {
    const error = new Error('Service failure');
    mockContentfulService.fetchProducts.mockRejectedValue(error);

    await expect(controller.fetchProducts()).rejects.toThrow(
      InternalServerErrorException,
    );
  });
});
