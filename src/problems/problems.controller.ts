import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  Query,
} from '@nestjs/common';
import { CreateProblemDTO } from './dtos/create-problem.dto';
import { ProblemListDTO } from './dtos/problem-list.dto';
import { ProblemParamDTO, ProblemQueryDTO } from './dtos/problem.dto';
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
}
