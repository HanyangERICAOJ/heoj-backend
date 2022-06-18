import { Submission } from 'src/submissions/entities/submission.entity';
import { User } from 'src/users/entities/user.entity';
import {
  Column,
  Entity,
  ManyToOne,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Example } from '../interfaces/example.interface';
import { Testcase } from './testcase.entity';
import { Validator } from './validator.entity';

@Entity()
export class Problem {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  number: number;

  @Column()
  title: string;

  @Column()
  timeLimit: number;

  @Column()
  memoryLimit: number;

  @Column()
  description: string;

  @Column()
  inputDescription: string;

  @Column()
  outputDescription: string;

  @Column()
  limitDescription: string;

  @Column({ type: 'jsonb' })
  examples: Example[];

  @OneToMany(() => Submission, (submission) => submission.problem)
  submissions: Submission[];

  @ManyToOne(() => User, (user) => user.problems)
  author: User;

  @OneToOne(() => Validator, (validator) => validator.problem)
  validator: Validator;

  @OneToMany(() => Testcase, (testcase) => testcase.problem)
  testcases: Testcase[];
}
