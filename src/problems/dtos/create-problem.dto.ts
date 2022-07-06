import { Type } from 'class-transformer';
import {
  IsNotEmpty,
  IsNumber,
  Validate,
  ValidateNested,
} from 'class-validator';
import { UserExistConstraint } from 'src/users/constraints/user-exist.constraint';
import { NumberNotExistConstraint } from '../constraints/number-not-exist.constraint';

class RelationUser {
  @Validate(UserExistConstraint)
  @IsNumber({ allowNaN: false, allowInfinity: false })
  @Type(() => Number)
  id: number;
}

export class CreateProblemDTO {
  @Validate(NumberNotExistConstraint)
  @IsNumber({ allowNaN: false, allowInfinity: false })
  @IsNotEmpty()
  @Type(() => Number)
  number: number;

  @IsNotEmpty()
  @ValidateNested()
  @Type(() => RelationUser)
  author: RelationUser;
}
