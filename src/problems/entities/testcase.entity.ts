import { User } from 'src/users/entities/user.entity';
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Problem } from './problem.entity';

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
}
