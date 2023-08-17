import {
  Entity,
  Column,
  ManyToOne,
  AfterInsert,
  AfterUpdate,
  AfterRemove,
} from 'typeorm';
import { Profile } from './profile.entity';
import { Profiling } from '../../common';

@Entity()
export class UserProfiling extends Profiling {
  @ManyToOne(() => Profile, (profile) => profile.profiling)
  profile: Profile;

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
