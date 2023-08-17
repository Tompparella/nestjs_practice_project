import {
  Entity,
  Column,
  ManyToOne,
  AfterInsert,
  AfterUpdate,
  AfterRemove,
} from 'typeorm';
import { Content } from './content.entity';
import { Profiling } from '../../common';

@Entity()
export class ContentProfiling extends Profiling {
  @ManyToOne(() => Content, (content) => content.profiling)
  content: Content;

  @Column()
  weight: number;

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
