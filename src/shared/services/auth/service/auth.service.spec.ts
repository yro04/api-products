import { JwtService } from '@nestjs/jwt';
import { AuthService } from './auth.service';
import { ValidatedUser } from '../dto/login.dto';

describe('AuthService', () => {
  let service: AuthService;
  let jwtService: JwtService;

  beforeEach(() => {
    jwtService = {
      sign: jest.fn().mockReturnValue('signed-token'),
    } as unknown as JwtService;

    service = new AuthService(jwtService);
  });

  describe('validateUser', () => {
    it('should return user when valid credentials', () => {
      const result = service.validateUser('admin', 'password');
      expect(result).toEqual({ username: 'admin', sub: '1' });
    });

    it('should return null when invalid credentials', () => {
      expect(service.validateUser('wrong', 'password')).toBeNull();
      expect(service.validateUser('admin', 'wrong')).toBeNull();
    });
  });

  describe('login', () => {
    it('should return accessToken', () => {
      const user: ValidatedUser = { username: 'admin', sub: '1' };
      const result = service.login(user);
      expect(jwtService.sign).toHaveBeenCalledWith(
        { username: 'admin', sub: '1', role: 'admin' },
        { expiresIn: process.env.JWT_EXPIRES_IN },
      );
      expect(result).toEqual({ accessToken: 'signed-token' });
    });
  });
});
