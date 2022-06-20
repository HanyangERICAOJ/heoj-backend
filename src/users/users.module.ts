import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { StudentIdNotExistConstraint } from './constraints/studentId-not-exist.constraint';
import { UserExistConstraint } from './constraints/user-exist.constraint';
import { UsernameNotExistConstraint } from './constraints/username-not-exist.constraint';
import { User } from './entities/user.entity';
import { UsersService } from './users.service';

@Module({
  imports: [TypeOrmModule.forFeature([User])],
  providers: [
    UsersService,
    UserExistConstraint,
    UsernameNotExistConstraint,
    StudentIdNotExistConstraint,
  ],
  exports: [UsersService],
})
export class UsersModule {}
