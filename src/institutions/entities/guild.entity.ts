import { User } from 'src/users';
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  OneToMany,
  ManyToOne,
} from 'typeorm';
import { University } from './university.entity';

@Entity()
export class Guild {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  name: string;

  @OneToMany(() => User, (user) => user.guild)
  users: User[];

  @ManyToOne(() => University, (university) => university.guilds, {
    nullable: false,
    eager: true,
  })
  university: University;
}
