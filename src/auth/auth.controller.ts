import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { Request, Response } from 'express';
import CreateUserDTO from 'src/users/dtos/create-user.dto';
import { AuthService } from './auth.service';
import { JwtAuthGuard } from './jwt-auth.guard';
import { LocalAuthGuard } from './local-auth.guard';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @HttpCode(HttpStatus.OK)
  @UseGuards(LocalAuthGuard)
  @Post('login')
  lgin(@Req() request: Request, @Res() response: Response) {
    const { user } = request;
    const { name, value, cookieOptions } = this.authService.login(user);
    response.cookie(name, value, cookieOptions);
    return response.send();
  }

  @Post('register')
  @HttpCode(HttpStatus.OK)
  async register(@Body() createUserDTO: CreateUserDTO) {
    await this.authService.register(createUserDTO);
  }

  @Post('logout')
  @HttpCode(HttpStatus.OK)
  async logout(@Res() response: Response) {
    const { name, value, cookieOptions } = this.authService.logout();
    response.cookie(name, value, cookieOptions);
    return response.send();
  }

  @HttpCode(HttpStatus.OK)
  @UseGuards(JwtAuthGuard)
  @Get('me')
  async me(@Req() request: Request) {
    const { user } = request;
    return user;
  }
}
