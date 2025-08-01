import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from '../service/auth.service';
import { InternalServerErrorException } from '@nestjs/common';

describe('AuthController', () => {
  let controller: AuthController;
  let authService: AuthService;

  const mockAuthService = {
    validateUser: jest.fn(),
    login: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        {
          provide: AuthService,
          useValue: mockAuthService,
        },
      ],
    }).compile();

    controller = module.get<AuthController>(AuthController);
    authService = module.get<AuthService>(AuthService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should return accessToken on successful login', () => {
    const dto = { username: 'testuser', password: 'testpass' };
    const mockUser = { username: 'testuser', sub: '123' };
    const mockToken = { accessToken: 'token123' };

    mockAuthService.validateUser.mockReturnValue(mockUser);
    mockAuthService.login.mockReturnValue(mockToken);

    const result = controller.login(dto);

    expect(authService.validateUser).toHaveBeenCalledWith(
      'testuser',
      'testpass',
    );
    expect(authService.login).toHaveBeenCalledWith(mockUser);
    expect(result).toEqual(mockToken);
  });

  it('should throw InternalServerErrorException on unexpected error', () => {
    const dto = { username: 'testuser', password: 'testpass' };
    mockAuthService.validateUser.mockImplementation(() => {
      throw new Error('Unexpected error');
    });

    expect(() => controller.login(dto)).toThrow(InternalServerErrorException);
  });
});
