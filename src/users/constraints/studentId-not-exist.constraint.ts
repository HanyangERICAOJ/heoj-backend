import { Injectable } from '@nestjs/common';
import {
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';
import { UsersService } from '../users.service';

@ValidatorConstraint({ async: true })
@Injectable()
export class StudentIdNotExistConstraint
  implements ValidatorConstraintInterface
{
  constructor(private readonly usersService: UsersService) {}

  validate(studentId: string): boolean | Promise<boolean> {
    return this.usersService.findOneByStudentId(studentId).then((user) => {
      return user === null;
    });
  }

  defaultMessage(): string {
    return '이미 존재하는 학번입니다.';
  }
}
