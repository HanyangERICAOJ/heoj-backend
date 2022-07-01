import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
  UploadedFiles,
  UseInterceptors,
} from '@nestjs/common';
import { CreateProblemDTO } from './dtos/create-problem.dto';
import { ProblemListDTO } from './dtos/problem-list.dto';
import { ProblemQueryDTO } from './dtos/problem.dto';
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import { UpdateProblemExampleDTO } from './dtos/update-problem-examples.dto';
import { ProblemsService } from './problems.service';
import * as AWS from 'aws-sdk';
import * as multerS3 from 'multer-s3';
import { Request } from 'express';
import { ConfigService } from '@nestjs/config';
import { isNumberString, ValidationError } from 'class-validator';

const s3 = new AWS.S3({
  region: 'ap-northeast-2',
});

@Controller('problems')
export class ProblemsController {
  private s3: AWS.S3;
  private multerS3: any;
  constructor(
    private readonly problemsService: ProblemsService,
    private readonly configService: ConfigService,
  ) {
    s3.config.update({
      credentials: {
        accessKeyId: configService.get<string>('AWS_ACCESS_KEY_ID'),
        secretAccessKey: configService.get<string>('AWS_SECRET_KEY'),
      },
    });
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() createProblemDTO: CreateProblemDTO) {
    await this.problemsService.create(createProblemDTO);
  }

  @Get()
  list(@Query() problemListDTO: ProblemListDTO) {
    return this.problemsService.findAll(problemListDTO);
  }

  @Get('/:number')
  problem(
    @Param('number', new ParseIntPipe()) number: number,
    @Query() problemQueryDTO: ProblemQueryDTO,
  ) {
    return this.problemsService.findOne(number, problemQueryDTO);
  }

  @Delete('/:number')
  delete(@Param('number', new ParseIntPipe()) number: number) {
    return this.problemsService.delete(number);
  }

  @Get('/:number/examples')
  problemExamples(@Param('number', new ParseIntPipe()) number: number) {
    return this.problemsService.problemExamples(number);
  }

  @Patch('/:number/examples')
  problemExamplesUpdate(
    @Param('number', new ParseIntPipe()) number: number,
    @Body() updateProblemExampleDTO: UpdateProblemExampleDTO,
  ) {
    return this.problemsService.problemExampleUpdate(
      number,
      updateProblemExampleDTO,
    );
  }

  @Post('/:number/testcases')
  @UseInterceptors(
    FileFieldsInterceptor(
      [
        { name: 'input', maxCount: 1 },
        { name: 'output', maxCount: 1 },
      ],
      {
        storage: multerS3({
          s3: s3,
          bucket: 'heoj-testcase',
          key: function (request: Request, file, cb) {
            if (
              isNumberString(request.params.number, {
                allowInfinity: false,
                allowNaN: false,
              })
            ) {
              cb(
                null,
                `${request.params.number}/${Date.now() + file.originalname}`,
              );
            } else {
              // if ValidationError not upload testcase
              cb(new ValidationError(), null);
            }
          },
        }),
      },
    ),
  )
  createProblemTestcase(
    @Param('number', new ParseIntPipe()) number: number,
    @UploadedFiles()
    files: {
      input?: Express.MulterS3.File[];
      output?: Express.MulterS3.File[];
    },
  ) {
    return this.problemsService.createProblemTestcase(
      number,
      files.input[0],
      files.output[0],
    );
  }

  @Get('/:number/testcases')
  problemTestcases(@Param('number', new ParseIntPipe()) number: number) {
    return this.problemsService.problemTestcases(number);
  }

  @Get('/testcases/:id')
  testcase(@Param('id', new ParseIntPipe()) id: number) {
    return this.problemsService.testcase(id);
  }

  @Delete('/testcases/:id')
  deleteTestcase(@Param('id', new ParseIntPipe()) id: number) {
    return this.problemsService.deleteTestcase(id);
  }
}
