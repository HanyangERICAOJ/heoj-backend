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

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
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
