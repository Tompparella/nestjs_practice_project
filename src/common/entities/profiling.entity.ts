import { Entity, ManyToOne } from 'typeorm';
import { Tag } from './tag.entity';
import { Base } from './base.entity';

@Entity()
export abstract class Profiling extends Base {
  @ManyToOne(() => Tag, (tag) => tag.profiling, {
    eager: true,
    nullable: false,
  })
  tag: Tag;
}
