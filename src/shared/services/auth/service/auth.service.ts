import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ValidatedUser } from '../dto/login.dto';

@Injectable()
export class AuthService {
  // Hardcoded user
  private readonly user = {
    username: 'admin',
    password: 'password',
    sub: '1',
  };

  constructor(private jwtService: JwtService) {}

  validateUser(username: string, password: string): ValidatedUser | null {
    if (username === this.user.username && password === this.user.password) {
      const { username, sub } = this.user;
      return { username, sub };
    }
    return null;
  }

  login(user: ValidatedUser): { accessToken: string } {
    const payload = { username: user.username, sub: user.sub, role: 'admin' };
    this.jwtService.sign(payload, { expiresIn: process.env.JWT_EXPIRES_IN });
    const accessToken = this.jwtService.sign(payload);
    return { accessToken };
  }
}
