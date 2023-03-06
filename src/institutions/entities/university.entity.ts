import { User } from 'src/users';
import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm';
import { Guild } from './guild.entity';

@Entity()
export class University {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  name: string;

  @OneToMany(() => User, (user) => user.guild.university)
  users: User[];

  @OneToMany(() => Guild, (guild) => guild.university)
  guilds: Guild[];
}
