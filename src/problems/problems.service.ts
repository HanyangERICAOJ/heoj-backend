import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateProblemDTO } from './dtos/create-problem.dto';
import { ProblemListDTO } from './dtos/problem-list.dto';
import { ProblemParamDTO, ProblemQueryDTO } from './dtos/problem.dto';
import { UpdateProblemExampleDTO } from './dtos/update-problem-examples.dto';
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

  findOneByNumber(number: number) {
    return this.problemRepository.findOneBy({ number: number });
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

  async delete(number: number) {
    const problem = await this.problemRepository.findOneBy({ number: number });
    if (!problem) return new NotFoundException();

    await this.problemRepository.remove(problem);
  }

  async problemExample(number: number) {
    const problem = await this.problemRepository.findOneBy({ number: number });
    if (!problem) return new NotFoundException();

    return problem.examples;
  }

  async problemExampleUpdate(
    number: number,
    updateProblemExampleDTO: UpdateProblemExampleDTO,
  ) {
    const problem = await this.problemRepository.findOneBy({ number: number });
    if (!problem) return new NotFoundException();

    problem.examples = updateProblemExampleDTO.examples;
    await this.problemRepository.save(problem);
  }
}
