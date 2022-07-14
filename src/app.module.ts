import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersModule } from './users/users.module';
import { ProblemsModule } from './problems/problems.module';
import { SnakeNamingStrategy } from 'typeorm-naming-strategies';
import { SubmissionsModule } from './submissions/submissions.module';
import { ContestsModule } from './contests/contests.module';
import { LanguagesModule } from './languages/languages.module';
import { AuthModule } from './auth/auth.module';
import {
  SqsModule,
  SqsConfigOption,
  SqsConfig,
  SqsQueueType,
} from '@nestjs-packages/sqs';
import * as Joi from 'joi';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      validationSchema: Joi.object({
        DB_HOST: Joi.string().hostname(),
        DB_PORT: Joi.number().port(),
        DB_USERNAME: Joi.string(),
        DB_PASSWORD: Joi.string(),
        JWT_ACESS_TOKEN_SECRET: Joi.string(),
        JWT_EXPIRATION_TIME: Joi.number(),
        AWS_ACCOUNT_NUMBER: Joi.string(),
        AWS_ACCESS_KEY_ID: Joi.string(),
        AWS_SECRTE_KEY: Joi.string(),
        AWS_REGION: Joi.string(),
        AWS_SQS_ENDPOINT: Joi.string().uri(),
      }),
    }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DB_HOST,
      port: parseInt(process.env.DB_PORT),
      username: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_DATABASE,
      autoLoadEntities: true,
      synchronize: true,
      logging: ['query'],
      namingStrategy: new SnakeNamingStrategy(),
    }),
    UsersModule,
    ProblemsModule,
    SubmissionsModule,
    ContestsModule,
    LanguagesModule,
    AuthModule,
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
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
