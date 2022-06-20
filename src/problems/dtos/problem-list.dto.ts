import { IsNumber } from 'class-validator';
import { Type } from 'class-transformer';

export class ProblemListDTO {
  @IsNumber()
  @Type(() => Number)
  page = 1;

  @IsNumber()
  @Type(() => Number)
  take = 20;
}
