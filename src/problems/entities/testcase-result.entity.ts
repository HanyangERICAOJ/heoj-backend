import { Submission } from 'src/submissions/entities/submission.entity';
import { Column, Entity, JoinColumn, ManyToOne, PrimaryColumn } from 'typeorm';
import { Testcase } from './testcase.entity';

@Entity()
export class TestcaseResult {
  @PrimaryColumn()
  testcaseId: number;

  @ManyToOne(() => Testcase, (testcase) => testcase.results)
  @JoinColumn()
  testcase: Testcase;

  @PrimaryColumn()
  submissionId: number;

  @ManyToOne(() => Submission, (submission) => submission.results)
  @JoinColumn()
  submission: Submission;

  @Column()
  result: number;

  @Column({ default: null })
  time: number;

  @Column({ default: null })
  memory: number;
}
