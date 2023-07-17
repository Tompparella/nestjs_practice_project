import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToMany,
  ManyToOne,
  JoinTable,
  AfterInsert,
  AfterUpdate,
  AfterRemove,
} from 'typeorm';
import { Tag } from './tag.entity';
import { User } from '../../users/entities';
import { Guild } from '../../institutions/entities';

@Entity()
export class Content {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  url: string;

  @Column({ default: 0 })
  likes: number;

  @Column({ default: 0 })
  dislikes: number;

  @Column()
  title: string;

  @Column()
  type: 'image' | 'clip';

  @ManyToOne(() => User, (user) => user.content, {
    eager: true,
  })
  creator: User;

  @ManyToOne(() => Guild, (guild) => guild.content, {
    eager: true,
  })
  guild: Guild;

  @ManyToMany(() => Tag, (tag) => tag.content, {
    eager: true,
  })
  @JoinTable()
  tags: Tag[];

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
