import { SqsService } from '@nestjs-packages/sqs';
import { Controller } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { SubmissionsService } from './submissions.service';

@Controller('submissions')
export class SubmissionsController {
  constructor(
    private readonly submissionsService: SubmissionsService,
    private readonly configService: ConfigService,
    private readonly sqsService: SqsService,
  ) {
    
  }
}
