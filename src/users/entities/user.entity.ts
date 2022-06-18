import { Problem } from 'src/problems/entities/problem.entity';
import { Submission } from 'src/submissions/entities/submission.entity';
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  username: string;

  @Column()
  password: string;

  @Column({ unique: true })
  studentId: string;

  @Column()
  oneLineIntroduction: string;

  @OneToMany(() => Problem, (problem) => problem.author)
  problems: Problem[];

  @OneToMany(() => Submission, (submission) => submission.author)
  submissions: Submission[];
}
