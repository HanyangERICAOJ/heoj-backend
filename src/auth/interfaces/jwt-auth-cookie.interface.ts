import { CookieOptions } from 'express';

export interface JWTAuthCookie {
  name: string;
  value: string;
  cookieOptions: CookieOptions;
}
