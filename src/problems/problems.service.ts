import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateProblemDTO } from './dtos/create-problem.dto';
import { ProblemListDTO } from './dtos/problem-list.dto';
import { ProblemQueryDTO } from './dtos/problem.dto';
import { UpdateProblemExampleDTO } from './dtos/update-problem-examples.dto';
import { Problem } from './entities/problem.entity';
import { Testcase } from './entities/testcase.entity';
import { Validator } from './entities/validator.entity';

@Injectable()
export class ProblemsService {
  constructor(
    @InjectRepository(Problem)
    private readonly problemRepository: Repository<Problem>,
    @InjectRepository(Testcase)
    private readonly testcaseRepository: Repository<Testcase>,
    @InjectRepository(Validator)
    private readonly validatorRepository: Repository<Validator>,
  ) {}

  async create(createProblemDTO: CreateProblemDTO) {
    const problem = this.problemRepository.create(createProblemDTO);
    problem.validator = this.validatorRepository.create();

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
    user: Express.User,
    number: number,
    updateProblemExampleDTO: UpdateProblemExampleDTO,
  ) {
    // const problem = await this.problemRepository.findOneBy({ number: number });
    // if (!problem) throw new NotFoundException();

    const problem = await this.problemRepository
      .createQueryBuilder('problem')
      .select(['problem.id', 'problem.number', 'problem.examples'])
      .leftJoin('problem.author', 'author')
      .addSelect('author.id')
      .where('problem.number = :number', { number: number })
      .getOne();

    if (!problem) throw new NotFoundException();

    if (!this.isAuthorOrAdmin(problem.author?.id, user.id, user.isAdmin)) {
      throw new ForbiddenException();
    }

    problem.examples = updateProblemExampleDTO.examples;
    await this.problemRepository.save(problem);
  }

  async createProblemTestcase(
    user: Express.User,
    number: number,
    input: Express.MulterS3.File,
    output: Express.MulterS3.File,
  ) {
    // const problem = await this.problemRepository.findOneBy({ number: number });
    // if (!problem) throw new NotFoundException();
    const problem = await this.problemRepository
      .createQueryBuilder('problem')
      .leftJoin('problem.author', 'author')
      .select('author.id')
      .where('problem.number = :number', { number: number })
      .getOne();

    if (!problem) throw new NotFoundException();

    if (problem.author.id != user.id && !user.isAdmin) {
      throw new ForbiddenException();
    }

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
    const problem = await this.problemRepository.findOneBy({ number: number });
    if (!problem) throw new NotFoundException();

    // const testcases = await this.testcaseRepository.find({
    //   select: ['id', 'author'],
    //   where: {
    //     problem: { number: number },
    //   },
    //   relations: ['problem', 'author'],
    // });

    const testcases = await this.testcaseRepository
      .createQueryBuilder('testcase')
      .select()
      .leftJoin('testcase.problem', 'problem')
      .leftJoin('testcase.author', 'author')
      .addSelect('author.username')
      .where('problem.number = :number', { number: number })
      .getMany();

    return testcases;
  }

  async testcase(id: number) {
    const testcase = await this.testcaseRepository.findOneBy({ id: id });
    if (!testcase) throw new NotFoundException();

    return testcase;
  }

  async deleteTestcase(user: Express.User, id: number) {
    // const testcase = await this.testcaseRepository.findOneBy({ id: id });
    // if (!testcase) throw new NotFoundException();

    const testcase = await this.testcaseRepository
      .createQueryBuilder('testcase')
      .leftJoin('testcase.author', 'author')
      .select('author.id')
      .where('testcase.id = :id', { id: id })
      .getOne();

    if (!testcase) throw new NotFoundException();

    if (!this.isAuthorOrAdmin(testcase.author?.id, user.id, user.isAdmin)) {
      throw new ForbiddenException();
    }

    await this.testcaseRepository.remove(testcase);
  }

  async problemValidator(number: number) {
    const problem = await this.problemRepository
      .createQueryBuilder('problem')
      .leftJoin('problem.validator', 'validator')
      .select('validator')
      .addSelect('problem.number')
      .where('problem.number = :number', { number: number })
      .getOne();

    if (!problem) throw new NotFoundException();
    return problem.validator;
  }

  isAuthorOrAdmin(authorId: number, userId: number, isAdmin: boolean): boolean {
    if (isAdmin) return true;
    else if (authorId === undefined) return false;
    else return authorId === userId;
  }
}
