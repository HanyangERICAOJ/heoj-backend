import { Contest } from 'src/contests/entities/contest.entity';
import { Problem } from 'src/problems/entities/problem.entity';
import { User } from 'src/users/entities/user.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export class Submission {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  code: string;

  @Column({ nullable: true, default: null })
  time: number;

  @Column({ nullable: true, default: null })
  memory: number;

  @CreateDateColumn()
  submitTime: Date;

  @Column({ default: false })
  isAccepted: boolean;

  @Column({ default: false })
  isTest: boolean;

  @ManyToOne(() => Problem, (problem) => problem.submissions)
  problem: Problem;

  @ManyToOne(() => User, (user) => user.submissions)
  author: User;

  @ManyToOne(() => Contest, (contest) => contest.submissions)
  contest: Contest;
}
