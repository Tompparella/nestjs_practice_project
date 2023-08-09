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

  @Column({ nullable: false })
  title: string;

  @Column({ nullable: false })
  type: 'image' | 'clip';

  /**
   * Weights are stored as json strings in the following pattern:
   * { tagId: number, weight: number }[]
   */
  @Column()
  tagWeights: string;

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

  @ManyToMany(() => Tag, (tag) => tag.content, {
    eager: true,
    nullable: false,
  })
  @JoinTable()
  tags: Tag[];

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
