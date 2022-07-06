import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { NumberExistConstraint } from './constraints/number-exist.constraint';
import { NumberNotExistConstraint } from './constraints/number-not-exist.constraint';
import { Problem } from './entities/problem.entity';
import { Testcase } from './entities/testcase.entity';
import { Validator } from './entities/validator.entity';
import { ProblemsController } from './problems.controller';
import { ProblemsService } from './problems.service';
import { SubmissionsModule } from 'src/submissions/submissions.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Problem, Validator, Testcase]),
    SubmissionsModule,
  ],
  controllers: [ProblemsController],
  providers: [
    ProblemsService,
    NumberExistConstraint,
    NumberNotExistConstraint,
    ConfigService,
  ],
})
export class ProblemsModule {}
