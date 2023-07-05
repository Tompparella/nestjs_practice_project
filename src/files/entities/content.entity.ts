import { Tag } from 'src/profiles/entities/tag.entity';
import { Institution } from './../../institutions/entities/institution.entity';
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToMany,
  ManyToOne,
} from 'typeorm';
import { User } from 'src/users';

@Entity()
export class Content {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  url: string;

  @Column()
  likes: number;

  @Column()
  dislikes: number;

  @ManyToOne(() => User, (user) => user.content, {
    eager: true,
  })
  creator: User;

  @ManyToMany(() => Tag, (tag) => tag.content, {
    eager: true,
  })
  tags: Tag[];

  @ManyToOne(() => Institution, (institution) => institution.content, {
    eager: true,
  })
  institution: Institution;
}
