import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateProblemDTO } from './dtos/create-problem.dto';
import { ProblemListDTO } from './dtos/problem-list.dto';
import { ProblemQueryDTO } from './dtos/problem.dto';
import { UpdateProblemExampleDTO } from './dtos/update-problem-examples.dto';
import { Problem } from './entities/problem.entity';
import { Testcase } from './entities/testcase.entity';

@Injectable()
export class ProblemsService {
  constructor(
    @InjectRepository(Problem)
    private readonly problemRepository: Repository<Problem>,
    @InjectRepository(Testcase)
    private readonly testcaseRepository: Repository<Testcase>,
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

  async findOne(number: number, problemQueryDTO: ProblemQueryDTO) {
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

    const problem = await this.problemRepository
      .createQueryBuilder('problem')
      .where({ number: number })
      .leftJoin('problem.author', 'author')
      .select(select)
      .getOne();

    if (!problem) throw new NotFoundException();

    return problem;
  }

  async delete(number: number) {
    const problem = await this.problemRepository.findOneBy({ number: number });
    if (!problem) throw new NotFoundException();

    await this.problemRepository.remove(problem);
  }

  async problemExamples(number: number) {
    const problem = await this.problemRepository.findOneBy({ number: number });
    if (!problem) throw new NotFoundException();

    return problem.examples;
  }

  async problemExampleUpdate(
    number: number,
    updateProblemExampleDTO: UpdateProblemExampleDTO,
  ) {
    const problem = await this.problemRepository.findOneBy({ number: number });
    if (!problem) throw new NotFoundException();

    problem.examples = updateProblemExampleDTO.examples;
    await this.problemRepository.save(problem);
  }

  async createProblemTestcase(
    number: number,
    input: Express.MulterS3.File,
    output: Express.MulterS3.File,
  ) {
    const problem = await this.problemRepository.findOneBy({ number: number });
    if (!problem) throw new NotFoundException();

    const testcase = await this.testcaseRepository.create();
    testcase.inputUrl = input.location;
    testcase.inputEtag = input.etag;
    testcase.inputSize = input.size;

    testcase.outputUrl = output.location;
    testcase.outputEtag = output.etag;
    testcase.outputSize = output.size;

    testcase.problem = problem;

    await this.testcaseRepository.save(testcase);
  }

  async problemTestcases(number: number) {
    return;
  }

  async testcase(id: number) {
    const testcase = await this.testcaseRepository.findOneBy({ id: id });
    if (!testcase) throw new NotFoundException();

    return testcase;
  }

  async deleteTestcase(id: number) {
    const testcase = await this.testcaseRepository.findOneBy({ id: id });
    if (!testcase) throw new NotFoundException();

    await this.testcaseRepository.remove(testcase);
  }
}
