import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ContestProblem } from './entities/contest-problem.entity';
import { Contest } from './entities/contest.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Contest, ContestProblem])],
})
export class ContestsModule {}
