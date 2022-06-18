import { Column, Entity, OneToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Problem } from './problem.entity';

@Entity()
export class Validator {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  code: string;

  @OneToOne(() => Problem, (problem) => problem.validator)
  problem: Problem;
}
