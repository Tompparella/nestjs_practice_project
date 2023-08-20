import {
  Entity,
  Column,
  OneToMany,
  AfterInsert,
  AfterUpdate,
  AfterRemove,
} from 'typeorm';
import { Base } from './base.entity';
import { Profiling } from './profiling.entity';

@Entity()
export class Tag extends Base {
  @Column({ unique: true })
  name: string;

  @Column()
  description: string;

  @Column({ nullable: true })
  imageUrl: string;

  @OneToMany(() => Profiling, (profiling) => profiling.tag)
  profiling: Profiling[];

  @AfterInsert()
  logInsert() {
    console.log(`+ Created tag with id ${this.id}`);
  }
  @AfterUpdate()
  logUpdate() {
    console.log(`! Updated tag with id ${this.id}`);
  }
  @AfterRemove()
  logRemove() {
    console.log(`- Removed tag with id ${this.id}`);
  }
}
