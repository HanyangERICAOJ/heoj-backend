import { Submission } from 'src/submissions/entities/submission.entity';
import { User } from 'src/users/entities/user.entity';
import {
  Column,
  Entity,
  JoinColumn,
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

  @Column({ default: '' })
  title: string;

  @Column({ default: 1 })
  timeLimit: number;

  @Column({ default: 512 })
  memoryLimit: number;

  @Column({ default: '' })
  description: string;

  @Column({ default: '' })
  inputDescription: string;

  @Column({ default: '' })
  outputDescription: string;

  @Column({ default: '' })
  limitDescription: string;

  @Column({ type: 'jsonb', default: [] })
  examples: Example[];

  @OneToMany(() => Submission, (submission) => submission.problem)
  submissions: Submission[];

  @ManyToOne(() => User, (user) => user.problems, { onDelete: 'SET NULL' })
  author?: User;

  @OneToOne(() => Validator, (validator) => validator.problem, {
    cascade: true,
  })
  @JoinColumn()
  validator: Validator;

  @OneToMany(() => Testcase, (testcase) => testcase.problem, {
    cascade: true,
  })
  testcases: Testcase[];
}
