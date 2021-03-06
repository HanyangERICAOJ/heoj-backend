import { Problem } from 'src/problems/entities/problem.entity';
import { Submission } from 'src/submissions/entities/submission.entity';
import {
  AfterLoad,
  BeforeInsert,
  BeforeUpdate,
  Column,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import * as bcrypt from 'bcrypt';
import { Testcase } from 'src/problems/entities/testcase.entity';

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

  @Column({ default: '' })
  oneLineIntroduction: string;

  @Column({ default: false })
  isAdmin: boolean;

  @OneToMany(() => Problem, (problem) => problem.author)
  problems: Problem[];

  @OneToMany(() => Submission, (submission) => submission.author)
  submissions: Submission[];

  @OneToMany(() => Testcase, (testcase) => testcase.author)
  testcases: Testcase[];

  // Hash Password, use find* and save

  beforePassword: string;

  @AfterLoad()
  private loadBeforePassword() {
    this.beforePassword = this.password;
  }

  @BeforeInsert()
  @BeforeUpdate()
  private async hashPassword() {
    const password = this.password;
    this.password = await bcrypt.hash(password, 10);
  }
}
