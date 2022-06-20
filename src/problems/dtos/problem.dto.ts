import { Transform, Type } from 'class-transformer';
import { IsBoolean, IsNumber } from 'class-validator';

export class ProblemQueryDTO {
  @IsBoolean()
  @Transform(({ value }) => value === 'true')
  description: boolean;
}

export class ProblemParamDTO {
  @IsNumber()
  @Type(() => Number)
  number: number;
}
