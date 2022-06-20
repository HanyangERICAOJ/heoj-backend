import { Injectable } from '@nestjs/common';
import {
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';
import { ProblemsService } from '../problems.service';

@ValidatorConstraint({ async: true })
@Injectable()
export class NumberNotExistConstraint implements ValidatorConstraintInterface {
  constructor(private readonly problemsService: ProblemsService) {}

  validate(number: number): boolean | Promise<boolean> {
    return this.problemsService.findOneByNumber(number).then((problem) => {
      return problem === null;
    });
  }

  defaultMessage(): string {
    return '이미 존재하는 문제 번호입니다.';
  }
}
