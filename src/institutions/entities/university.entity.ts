import { User } from '../../users/entities';
import { Entity, OneToMany } from 'typeorm';
import { Guild } from './guild.entity';
import { Institution } from './institution.entity';

@Entity()
export class University extends Institution {
  @OneToMany(() => User, (user) => user.guild.university)
  users: User[];

  @OneToMany(() => Guild, (guild) => guild.university)
  guilds: Guild[];
}
