import { Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Tag } from './tag.entity';

@Entity()
export class Profiling {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Tag, (tag) => tag.contentProfiles, {
    eager: true,
    nullable: false,
  })
  tag: Tag;
}
