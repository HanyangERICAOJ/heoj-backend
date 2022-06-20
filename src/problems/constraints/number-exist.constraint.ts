import { Injectable } from '@nestjs/common';
import {
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';
import { ProblemsService } from '../problems.service';

@ValidatorConstraint({ async: true })
@Injectable()
export class NumberExistConstraint implements ValidatorConstraintInterface {
  constructor(private readonly problemsService: ProblemsService) {}

  validate(number: number): boolean | Promise<boolean> {
    return this.problemsService.findOneByNumber(number).then((problem) => {
      return problem !== null;
    });
  }

  defaultMessage(): string {
    return '존재하지 않는 문제입니다.';
  }
}
