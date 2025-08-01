import { IsString } from 'class-validator';

export class LoginDto {
  @IsString()
  username: string;

  @IsString()
  password: string;
}

export interface ValidatedUser {
  username: string;
  sub: string | number;
}
