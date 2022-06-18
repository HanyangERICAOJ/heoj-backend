import { Submission } from 'src/submissions/entities/submission.entity';
import {
  Column,
  Entity,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { ContestProblem } from './contest-problem.entity';

@Entity()
export class Contest {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @Column({ type: 'timestamp without time zone' })
  startTime: Date;

  @Column({ type: 'timestamp without time zone' })
  endTime: Date;

  @Column()
  freezeTime: number;

  @Column()
  freezeSolve: number;

  @OneToOne(() => Submission)
  lastSubmissionBeforeFreeze: Submission;

  @OneToMany(() => Submission, (submission) => submission.contest)
  submissions: Submission[];

  @OneToMany(() => ContestProblem, (contestProblem) => contestProblem.contest)
  problems: ContestProblem[];
}
