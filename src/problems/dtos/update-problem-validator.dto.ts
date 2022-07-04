import { IsDefined } from 'class-validator';

export class UpdateProblemValidatorDTO {
  @IsDefined()
  code: string;
}
