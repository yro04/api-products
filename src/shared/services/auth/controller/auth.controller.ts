import {
  Controller,
  Post,
  Body,
  UnauthorizedException,
  Logger,
  BadRequestException,
  InternalServerErrorException,
} from '@nestjs/common';
import { AuthService } from '../service/auth.service';
import { ApiTags, ApiBody } from '@nestjs/swagger';
import { LoginDto } from '../dto/login.dto';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  private readonly _logger = new Logger(AuthController.name);
  constructor(private _authService: AuthService) {}

  @Post('login')
  @ApiBody({ type: LoginDto })
  login(@Body() body: LoginDto): { accessToken: string } {
    try {
      const { username, password } = body;

      if (!username || !password) {
        throw new BadRequestException('Username and password are required');
      }

      const user = this._authService.validateUser(username, password);
      if (!user) {
        throw new UnauthorizedException('Invalid credentials');
      }

      return this._authService.login(user);
    } catch (error) {
      this._logger.error('Error fetching products from Contentful', error);
      throw new InternalServerErrorException();
    }
  }
}
