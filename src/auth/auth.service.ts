import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from 'src/users/users.service';
import * as bcrypt from 'bcrypt';
import { JWTAuthCookie } from './interfaces/jwt-auth-cookie.interface';
import CreateUserDTO from 'src/users/dtos/create-user.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  async validateUser(username: string, password: string): Promise<any> {
    const user = await this.usersService.findOneByUsername(username);

    if (user) {
      const compare = await bcrypt.compare(password, user.password);
      if (compare) {
        const {
          // eslint-disable-next-line @typescript-eslint/no-unused-vars
          password,
          // eslint-disable-next-line @typescript-eslint/no-unused-vars
          beforePassword,
          // eslint-disable-next-line @typescript-eslint/no-unused-vars
          oneLineIntroduction,
          ...result
        } = user;
        return result;
      } else return null;
    }
    return null;
  }

  login(user: any): JWTAuthCookie {
    const payload = { username: user.username, id: user.userId };
    const token = this.jwtService.sign(payload);
    return {
      name: 'Authentication',
      value: token,
      cookieOptions: {
        maxAge: this.configService.get<number>('JWT_EXPIRATION_TIME') * 1000,
        httpOnly: true,
        path: '/',
        sameSite: 'strict',
      },
    };
  }

  logout(): JWTAuthCookie {
    return {
      name: 'Authentication',
      value: '',
      cookieOptions: {
        httpOnly: true,
        path: '/',
        maxAge: 0,
        sameSite: 'strict',
      },
    };
  }

  async register(createUserDTO: CreateUserDTO) {
    return this.usersService.create(createUserDTO);
  }
}
