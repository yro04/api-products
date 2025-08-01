import { Test, TestingModule } from '@nestjs/testing';
import { ContentfulService } from './contentful.service';
import { ConfigService } from '@nestjs/config';
import { HttpException, HttpStatus } from '@nestjs/common';

describe('ContentfulService', () => {
  let service: ContentfulService;
  let configService: ConfigService;

  // Mock createClient and its getEntries method
  const mockGetEntries = jest.fn();

  // Mock createClient to return an object with getEntries
  jest.mock('contentful', () => ({
    createClient: jest.fn(() => ({
      getEntries: mockGetEntries,
    })),
  }));

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ContentfulService,
        {
          provide: ConfigService,
          useValue: {
            get: jest.fn((key: string) => {
              const values = {
                CONTENTFUL_SPACE_ID: 'spaceId',
                CONTENTFUL_ACCESS_TOKEN: 'accessToken',
                CONTENTFUL_ENVIRONMENT: 'master',
                CONTENTFUL_CONTENT_TYPE: 'product',
              };
              return values[key];
            }),
          },
        },
      ],
    }).compile();

    service = module.get<ContentfulService>(ContentfulService);
    configService = module.get<ConfigService>(ConfigService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });


  it('should throw HttpException on fetch error', async () => {
    mockGetEntries.mockRejectedValue(new Error('Fetch error'));

    await expect(service.fetchProducts()).rejects.toThrow(HttpException);

    await expect(service.fetchProducts()).rejects.toMatchObject({
      status: HttpStatus.BAD_GATEWAY,
      message: 'Failed to fetch products from Contentful',
    });
  });
});
