import { Content } from '../../content/entities';
import { Guild } from '../../institutions/entities';
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  AfterInsert,
  AfterUpdate,
  AfterRemove,
  ManyToOne,
  OneToMany,
} from 'typeorm';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  username: string;

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

  @AfterInsert()
  logInsert() {
    console.log(`Created user ${this.username} with id ${this.id}`);
  }
  @AfterUpdate()
  logUpdate() {
    console.log(`Updated user ${this.username} with id ${this.id}`);
  }
  @AfterRemove()
  logRemove() {
    console.log(`Removed user ${this.username} with id ${this.id}`);
  }
}
