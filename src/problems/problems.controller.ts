import {
  Body,
  Controller,
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
  constructor(private readonly problmesService: ProblemsService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() createProblemDTO: CreateProblemDTO) {
    await this.problmesService.create(createProblemDTO);
  }

  @Get()
  list(@Query() problemListDTO: ProblemListDTO) {
    return this.problmesService.findAll(problemListDTO);
  }

  @Get('/:number')
  problem(
    @Query() problemQueryDTO: ProblemQueryDTO,
    @Param() problemParamDTO: ProblemParamDTO,
  ) {
    return this.problmesService.findOne(problemQueryDTO, problemParamDTO);
  }

  @Get('/:number/examples')
  problemExamples(@Param('number', new ParseIntPipe()) number: number) {
    return this.problmesService.problemExample(number);
  }

  @Patch('/:number/examples')
  problemExamplesUpdate(
    @Param('number', new ParseIntPipe()) number: number,
    @Body() updateProblemExampleDTO: UpdateProblemExampleDTO,
  ) {
    return this.problmesService.problemExampleUpdate(
      number,
      updateProblemExampleDTO,
    );
  }
}
