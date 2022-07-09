import { Submission } from 'src/submissions/entities/submission.entity';
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Language {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  compile: string;

  @Column()
  execute: string;

  @Column()
  version: string;

  @Column()
  example: string;

  @Column()
  fileName: string;

  @OneToMany(() => Submission, (submission) => submission.language)
  submissions: Submission[];
}
