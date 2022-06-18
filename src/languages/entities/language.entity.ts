import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

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
}
