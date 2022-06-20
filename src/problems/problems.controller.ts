import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { CreateProblemDTO } from './dtos/create-problem.dto';
import { ProblemListDTO } from './dtos/problem-list.dto';
import { ProblemParamDTO, ProblemQueryDTO } from './dtos/problem.dto';
import { UpdateProblemExampleDTO } from './dtos/update-problem-examples.dto';
import { ProblemsService } from './problems.service';

@Controller('problems')
export class ProblemsController {
  constructor(private readonly problemsService: ProblemsService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() createProblemDTO: CreateProblemDTO) {
    await this.problemsService.create(createProblemDTO);
  }

  @Get()
  list(@Query() problemListDTO: ProblemListDTO) {
    return this.problemsService.findAll(problemListDTO);
  }

  @Get('/:number')
  problem(
    @Query() problemQueryDTO: ProblemQueryDTO,
    @Param() problemParamDTO: ProblemParamDTO,
  ) {
    return this.problemsService.findOne(problemQueryDTO, problemParamDTO);
  }

  @Delete('/:number')
  delete(@Param('number', new ParseIntPipe()) number: number) {
    return this.problemsService.delete(number);
  }

  @Get('/:number/examples')
  problemExamples(@Param('number', new ParseIntPipe()) number: number) {
    return this.problemsService.problemExample(number);
  }

  @Patch('/:number/examples')
  problemExamplesUpdate(
    @Param('number', new ParseIntPipe()) number: number,
    @Body() updateProblemExampleDTO: UpdateProblemExampleDTO,
  ) {
    return this.problemsService.problemExampleUpdate(
      number,
      updateProblemExampleDTO,
    );
  }
}
