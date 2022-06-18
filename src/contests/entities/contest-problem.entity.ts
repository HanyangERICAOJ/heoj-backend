import { Problem } from 'src/problems/entities/problem.entity';
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Contest } from './contest.entity';

@Entity()
export class ContestProblem {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  number: string;

  @Column()
  order: number;

  @ManyToOne(() => Contest, (contest) => contest.problems)
  contest: Contest;

  @ManyToOne(() => Problem)
  problem: Problem;
}
