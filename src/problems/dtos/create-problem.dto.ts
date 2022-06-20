import { Transform, Type } from 'class-transformer';
import { IsNotEmpty, Validate } from 'class-validator';
import { UserExistConstraint } from 'src/users/constraints/user-exist.constraint';
import { User } from 'src/users/entities/user.entity';
import { DeepPartial } from 'typeorm';
import { NumberNotExistConstraint } from '../constraints/number-not-exist.constraint';

export class CreateProblemDTO {
  @IsNotEmpty()
  @Type(() => Number)
  @Validate(NumberNotExistConstraint)
  number: number;

  @Validate(UserExistConstraint)
  @Transform(({ value }) => {
    return { id: value };
  })
  author: DeepPartial<User>;
}
