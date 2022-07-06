import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Problem } from 'src/problems/entities/problem.entity';
import { Repository } from 'typeorm';
import { CreateSubmissionDTO } from './dtos/create-submission.dto';
import { Submission } from './entities/submission.entity';

@Injectable()
export class SubmissionsService {
  constructor(
    @InjectRepository(Submission)
    private readonly submissionRepository: Repository<Submission>,
    @InjectRepository(Problem)
    private readonly problemRepository: Repository<Problem>,
  ) {}

  async createProblemSubmission(
    number: number,
    createSubmissionDTO: CreateSubmissionDTO,
  ) {
    const problem = await this.problemRepository.findOneBy({ number: number });
    if (!problem) throw new BadRequestException();

    const submission = this.submissionRepository.create(createSubmissionDTO);
    await this.submissionRepository.save(submission);

    // judge queue
  }
}
