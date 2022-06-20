import { Injectable } from '@nestjs/common';
import {
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';
import { DeepPartial } from 'typeorm';
import { User } from '../entities/user.entity';
import { UsersService } from '../users.service';

@ValidatorConstraint({ async: true })
@Injectable()
export class UserExistConstraint implements ValidatorConstraintInterface {
  constructor(private readonly usersService: UsersService) {}

  validate(user: DeepPartial<User>): boolean | Promise<boolean> {
    if (!user || !user.id) return false;
    return this.usersService.findOneById(user.id).then((user) => {
      return user !== null;
    });
  }

  defaultMessage(): string {
    return '존재하지 않는 사용자입니다.';
  }
}
