import { Injectable } from '@nestjs/common';
import {
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';
import { UsersService } from '../users.service';

@ValidatorConstraint({ async: true })
@Injectable()
export class UsernameNotExistConstraint
  implements ValidatorConstraintInterface
{
  constructor(private readonly usersService: UsersService) {}

  validate(username: string): boolean | Promise<boolean> {
    return this.usersService.findOneByUsername(username).then((user) => {
      return user === null;
    });
  }

  defaultMessage(): string {
    return '이미 존재하는 아이디입니다.';
  }
}
