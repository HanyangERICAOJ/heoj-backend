import { Injectable } from '@nestjs/common';
import {
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';
import { UsersService } from '../users.service';

@ValidatorConstraint({ async: true })
@Injectable()
export class UserExistConstraint implements ValidatorConstraintInterface {
  constructor(private readonly usersService: UsersService) {}

  validate(id: number): boolean | Promise<boolean> {
    return this.usersService.findOneById(id).then((user) => {
      return user !== null;
    });
  }

  defaultMessage(): string {
    return '존재하지 않는 사용자입니다.';
  }
}
