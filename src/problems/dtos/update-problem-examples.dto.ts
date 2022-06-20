import { Transform, Type } from 'class-transformer';
import { IsNotEmpty, Validate } from 'class-validator';
import { NumberExistConstraint } from '../constraints/number-exist.constraint';
import { Example } from '../interfaces/example.interface';

export class UpdateProblemExampleDTO {
  @IsNotEmpty()
  @Type(() => Number)
  @Validate(NumberExistConstraint)
  number: number;

  examples: Example[];
}
