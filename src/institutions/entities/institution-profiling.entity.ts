import { Entity, Column, ManyToOne } from 'typeorm';
import { Profiling } from '../../common';
import { Institution } from './institution.entity';

@Entity()
export class InstitutionProfiling extends Profiling {
  @ManyToOne(() => Institution, (institution) => institution.profiling)
  institution: Institution;

  @Column()
  liking: number;

  @Column()
  disliking: number;

  /* @AfterInsert()
  logInsert() {
    console.log(`+ Created user ${this.username} with id ${this.id}`);
  }
  @AfterUpdate()
  logUpdate() {
    console.log(`! Updated user ${this.username} with id ${this.id}`);
  }
  @AfterRemove()
  logRemove() {
    console.log(`- Removed user ${this.username} with id ${this.id}`);
  } */
}
