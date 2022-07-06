import { Injectable } from '@nestjs/common';
import {
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';
import { LanguagesService } from '../languages.service';

@ValidatorConstraint({ async: true })
@Injectable()
export class LanguageExistConstraint implements ValidatorConstraintInterface {
  constructor(private readonly languagesService: LanguagesService) {}

  validate(id: number): boolean | Promise<boolean> {
    return this.languagesService.findOneById(id).then((language) => {
      return language !== null;
    });
  }

  defaultMessage(): string {
    return '존재하지 않는 언어입니다.';
  }
}
