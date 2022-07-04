import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
  Req,
  UploadedFiles,
  UseGuards,
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
import { AdminGuard } from 'src/auth/admin.guard';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { UpdateProblemValidatorDTO } from './dtos/update-problem-validator.dto';

const s3 = new AWS.S3();

@Controller('problems')
export class ProblemsController {
  constructor(
    private readonly problemsService: ProblemsService,
    private readonly configService: ConfigService,
  ) {
    s3.config.update({
      region: configService.get<string>('AWS_REGION'),
      credentials: {
        accessKeyId: configService.get<string>('AWS_ACCESS_KEY_ID'),
        secretAccessKey: configService.get<string>('AWS_SECRET_KEY'),
      },
    });
  }

  @Post()
  @UseGuards(JwtAuthGuard, AdminGuard)
  create(@Body() createProblemDTO: CreateProblemDTO) {
    this.problemsService.create(createProblemDTO);
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
  @UseGuards(JwtAuthGuard, AdminGuard)
  delete(@Param('number', new ParseIntPipe()) number: number) {
    return this.problemsService.delete(number);
  }

  @Get('/:number/examples')
  problemExamples(@Param('number', new ParseIntPipe()) number: number) {
    return this.problemsService.problemExamples(number);
  }

  @Patch('/:number/examples')
  @UseGuards(JwtAuthGuard)
  updateProblemExamples(
    @Req() request: Request,
    @Param('number', new ParseIntPipe()) number: number,
    @Body() updateProblemExampleDTO: UpdateProblemExampleDTO,
  ) {
    return this.problemsService.problemExampleUpdate(
      request.user,
      number,
      updateProblemExampleDTO,
    );
  }

  @Post('/:number/testcases')
  @UseGuards(JwtAuthGuard)
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
    @Req() request: Request,
    @Param('number', new ParseIntPipe()) number: number,
    @UploadedFiles()
    files: {
      input?: Express.MulterS3.File[];
      output?: Express.MulterS3.File[];
    },
  ) {
    return this.problemsService.createProblemTestcase(
      request.user,
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
  @UseGuards(JwtAuthGuard)
  deleteTestcase(
    @Req() request: Request,
    @Param('id', new ParseIntPipe()) id: number,
  ) {
    return this.problemsService.deleteTestcase(request.user, id);
  }

  @Get('/:number/validator')
  problemValidator(@Param('number', new ParseIntPipe()) number: number) {
    return this.problemsService.problemValidator(number);
  }

  @Patch('/:number/validator')
  updateProblemValidator(
    @Param('number', new ParseIntPipe()) number: number,
    @Body() updateProblemValidatorDTO: UpdateProblemValidatorDTO,
  ) {
    return this.problemsService.updateProblemValidator(
      number,
      updateProblemValidatorDTO,
    );
  }
}
