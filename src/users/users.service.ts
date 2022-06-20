import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import CreateUserDTO from './dtos/create-user.dto';
import { User } from './entities/user.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async create(createUserDTO: CreateUserDTO) {
    const user = this.userRepository.create(createUserDTO);
    await this.userRepository.save(user);
  }

  findOneById(id: number): Promise<User | null> {
    return this.userRepository.findOneBy({ id: id });
  }

  findOneByUsername(username: string): Promise<User | null> {
    return this.userRepository.findOneBy({ username: username });
  }

  findOneByStudentId(studentId: string): Promise<User | null> {
    return this.userRepository.findOneBy({ studentId: studentId });
  }
}
