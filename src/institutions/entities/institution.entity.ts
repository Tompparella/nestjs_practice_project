import { Base } from '../../common';
import { Entity, Column, OneToMany } from 'typeorm';
import { InstitutionProfiling } from './institution-profiling.entity';

@Entity()
export abstract class Institution extends Base {
  @Column({ unique: true })
  name: string;

  @Column({ nullable: true })
  imageUrl: string;

  @Column({ nullable: true })
  description: string;

  @OneToMany(() => InstitutionProfiling, (profiling) => profiling.institution, {
    cascade: true,
    eager: true,
  })
  profiling: InstitutionProfiling[];
}
