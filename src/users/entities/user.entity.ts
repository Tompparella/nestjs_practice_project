import { Content } from '../../content/entities';
import { Guild } from '../../institutions/entities';
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  AfterInsert,
  AfterUpdate,
  AfterRemove,
  JoinColumn,
  OneToOne,
  ManyToOne,
  ManyToMany,
  OneToMany,
} from 'typeorm';
import { Profile } from './profile.entity';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  email: string;

  @Column()
  password: string;

  @Column({ default: false })
  admin: boolean;

  @ManyToOne(() => Guild, (guild) => guild.users, {
    nullable: false,
    eager: true,
  })
  guild: Guild;

  @OneToMany(() => Content, (content) => content.creator)
  content: Content[];

  @ManyToMany(() => Content, (post) => post.likes)
  liked: Content[];

  @ManyToMany(() => Content, (post) => post.dislikes)
  disliked: Content[];

  @OneToOne(() => Profile, (profile) => profile.user)
  @JoinColumn()
  profile: Profile;

  @AfterInsert()
  logInsert() {
    console.log(`+ Created user ${this.id}`);
  }
  @AfterUpdate()
  logUpdate() {
    console.log(`! Updated user ${this.id}`);
  }
  @AfterRemove()
  logRemove() {
    console.log(`- Removed user ${this.id}`);
  }
}
