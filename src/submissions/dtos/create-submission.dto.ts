import { Type } from 'class-transformer';
import {
  IsDefined,
  IsNotEmpty,
  IsNumber,
  Validate,
  ValidateNested,
} from 'class-validator';
import { LanguageExistConstraint } from 'src/languages/constraints/language-exist.constraint';

class RelationLanguage {
  @Validate(LanguageExistConstraint)
  @IsNumber({ allowNaN: false, allowInfinity: false })
  @Type(() => Number)
  id: number;
}

export class CreateSubmissionDTO {
  @IsDefined()
  code: string;

  @IsNotEmpty()
  @ValidateNested()
  @Type(() => RelationLanguage)
  language: RelationLanguage;
}
