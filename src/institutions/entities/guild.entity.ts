import { User } from 'src/users';
import { Content } from '../../content/entities';
import {
  Entity,
  OneToMany,
  ManyToOne,
  AfterInsert,
  AfterUpdate,
  AfterRemove,
} from 'typeorm';
import { University } from './university.entity';
import { Institution } from './institution.entity';

@Entity()
export class Guild extends Institution {
  @OneToMany(() => User, (user) => user.guild)
  users: User[];

  @OneToMany(() => Content, (content) => content.guild)
  content: Content[];

  @ManyToOne(() => University, (university) => university.guilds, {
    nullable: false,
    eager: true,
  })
  university: University;

  @AfterInsert()
  logInsert() {
    console.log(`+ Guild ${this.id} '${this.name}' created`);
  }
  @AfterUpdate()
  logUpdate() {
    console.log(`! Guild ${this.id} '${this.name}' updated`);
  }
  @AfterRemove()
  logRemove() {
    console.log(`- Guild ${this.id} '${this.name}' removed`);
  }
}
