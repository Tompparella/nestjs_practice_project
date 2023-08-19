import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToMany,
  ManyToOne,
  OneToMany,
  JoinTable,
  AfterInsert,
  AfterUpdate,
  AfterRemove,
} from 'typeorm';
import { User } from '../../users/entities';
import { Guild } from '../../institutions/entities';
import { ContentProfiling } from './content-profiling.entity';
import { Base } from '../../common';

@Entity()
export class Content extends Base {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  url: string;

  @Column({ nullable: false })
  title: string;

  @Column({ nullable: false })
  type: 'image' | 'clip';

  @ManyToOne(() => User, (user) => user.content, {
    eager: true,
    nullable: false,
  })
  creator: User;

  @ManyToOne(() => Guild, (guild) => guild.content, {
    eager: true,
    nullable: false,
  })
  guild: Guild;

  @OneToMany(() => ContentProfiling, (profiling) => profiling.content, {
    cascade: true,
    eager: true,
  })
  profiling: ContentProfiling[];

  @ManyToMany(() => User, (user) => user.liked, {
    eager: true,
    nullable: false,
  })
  @JoinTable()
  likes: User[];

  @ManyToMany(() => User, (user) => user.disliked, {
    eager: true,
    nullable: false,
  })
  @JoinTable()
  dislikes: User[];

  @AfterInsert()
  logInsert() {
    console.log(`+ User ${this.creator.id} created content with id ${this.id}`);
  }
  @AfterUpdate()
  logUpdate() {
    console.log(`! User ${this.creator.id} updated content with id ${this.id}`);
  }
  @AfterRemove()
  logRemove() {
    console.log(`- User ${this.creator.id} removed content with id ${this.id}`);
  }
}
