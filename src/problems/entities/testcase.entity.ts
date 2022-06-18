import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Problem } from './problem.entity';

@Entity()
export class Testcase {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  url: string;

  @Column()
  isValid: boolean;

  @ManyToOne(() => Problem, (problem) => problem.testcases)
  problem: Problem;
}
