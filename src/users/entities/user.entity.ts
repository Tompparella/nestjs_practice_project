import { Guild, University } from 'src/institutions';
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

  @Column()
  email: string;

  @Column()
  password: string;

  @ManyToOne(() => University, (university) => university.users, {
    nullable: false,
  })
  university: University;

  @ManyToOne(() => Guild, (guild) => guild.users, {
    nullable: false,
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
