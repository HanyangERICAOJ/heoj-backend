import { IsDefined } from 'class-validator';

export class CreateLanguageDTO {
  @IsDefined()
  name: string;

  @IsDefined()
  compile: string;

  @IsDefined()
  execute: string;

  @IsDefined()
  version: string;

  @IsDefined()
  example: string;
}
