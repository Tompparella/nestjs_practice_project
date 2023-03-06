import { Guild } from 'src/institutions';
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  AfterInsert,
  AfterUpdate,
  AfterRemove,
  ManyToOne,
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

  @Column({ default: true }) //TODO: CHANGE THIS
  admin: boolean;

  @ManyToOne(() => Guild, (guild) => guild.users, {
    nullable: false,
    eager: true,
  })
  guild: Guild;

  @AfterInsert()
  logInsert() {
    console.log(`Created user with id ${this.id}`);
  }
  @AfterUpdate()
  logUpdate() {
    console.log(`Updated user with id ${this.id}`);
  }
  @AfterRemove()
  logRemove() {
    console.log(`Removed user with id ${this.id}`);
  }
}
