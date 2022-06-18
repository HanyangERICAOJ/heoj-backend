import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersModule } from './users/users.module';
import { ProblemsModule } from './problems/problems.module';
import { SnakeNamingStrategy } from 'typeorm-naming-strategies';
import { SubmissionsModule } from './submissions/submissions.module';
import { ContestsModule } from './contests/contests.module';
import { LanguagesModule } from './languages/languages.module';

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
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
