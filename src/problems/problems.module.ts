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
import {
  SqsConfig,
  SqsConfigOption,
  SqsModule,
  SqsQueueType,
} from '@nestjs-packages/sqs';
import { SubmissionsModule } from 'src/submissions/submissions.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Problem, Validator, Testcase]),
    SqsModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => {
        const config: SqsConfigOption = {
          region: configService.get<string>('AWS_REGION'),
          endpoint: configService.get<string>('AWS_SQS_ENDPOINT'),
          accountNumber: configService.get<string>('AWS_ACCOUNT_NUMBER'),
          credentials: {
            accessKeyId: configService.get<string>('AWS_ACCESS_KEY_ID'),
            secretAccessKey: configService.get<string>('AWS_SECRET_KEY'),
          },
        };
        return new SqsConfig(config);
      },
      inject: [ConfigService],
    }),
    SqsModule.registerQueue({
      name: 'heoj-judge-queue.fifo',
      type: SqsQueueType.Producer,
    }),
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
