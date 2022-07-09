import { User } from 'src/users/entities/user.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Problem } from './problem.entity';
import { TestcaseResult } from './testcase-result.entity';

@Entity()
export class Testcase {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  inputUrl: string;

  @Column()
  outputUrl: string;

  @Column({ default: false })
  isValid: boolean;

  @Column()
  inputSize: number;

  @Column()
  outputSize: number;

  @Column()
  inputEtag: string;

  @Column()
  outputEtag: string;

  @ManyToOne(() => Problem, (problem) => problem.testcases, {
    onDelete: 'CASCADE',
  })
  problem: Problem;

  @ManyToOne(() => User, (user) => user.testcases, { onDelete: 'SET NULL' })
  author?: User;

  @CreateDateColumn({ type: 'timestamp without time zone' })
  createdAt: Date;

  @OneToMany(() => TestcaseResult, (testcaseResult) => testcaseResult.testcase)
  results: TestcaseResult[];
}
