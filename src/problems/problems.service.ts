import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateProblemDTO } from './dtos/create-problem.dto';
import { ProblemListDTO } from './dtos/problem-list.dto';
import { ProblemParamDTO, ProblemQueryDTO } from './dtos/problem.dto';
import { Problem } from './entities/problem.entity';

@Injectable()
export class ProblemsService {
  constructor(
    @InjectRepository(Problem)
    private readonly problemRepository: Repository<Problem>,
  ) {}

  async create(createProblemDTO: CreateProblemDTO) {
    const problem = this.problemRepository.create(createProblemDTO);
    await this.problemRepository.save(problem);
  }

  findAll(problemListDTO: ProblemListDTO) {
    const take = problemListDTO.take;
    const skip = (problemListDTO.page - 1) * problemListDTO.take;
    return this.problemRepository.find({
      take: take,
      skip: skip,
    });
  }

  findOne(problemQueryDTO: ProblemQueryDTO, problemParamDTO: ProblemParamDTO) {
    const baseField = [
      'id',
      'number',
      'title',
      'timeLimit',
      'memoryLimit',
      'author',
    ];

    const descriptionField = [
      'description',
      'inputDescription',
      'outputDescription',
      'limitDescription',
      'examples',
    ];

    const select = ['author.username'].concat(
      baseField
        .concat(problemQueryDTO.description ? descriptionField : [])
        .map((value) => `problem.${value}`),
    );

    return this.problemRepository
      .createQueryBuilder('problem')
      .where({ number: problemParamDTO.number })
      .leftJoin('problem.author', 'author')
      .select(select)
      .getOne();
  }
}
