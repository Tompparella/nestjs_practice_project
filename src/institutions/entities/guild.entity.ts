import { User } from 'src/users';
import { Entity, OneToMany, ManyToOne } from 'typeorm';
import { University } from './university.entity';
import { Institution } from './institution.entity';

@Entity()
export class Guild extends Institution {
  @OneToMany(() => User, (user) => user.guild)
  users: User[];

  @ManyToOne(() => University, (university) => university.guilds, {
    nullable: false,
    eager: true,
  })
  university: University;
}
