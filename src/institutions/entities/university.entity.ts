import {
  Entity,
  OneToMany,
  AfterInsert,
  AfterUpdate,
  AfterRemove,
} from 'typeorm';
import { Guild } from './guild.entity';
import { Institution } from './institution.entity';

@Entity()
export class University extends Institution {
  @OneToMany(() => Guild, (guild) => guild.university)
  guilds: Guild[];

  @AfterInsert()
  logInsert() {
    console.log(`+ University ${this.id} '${this.name}' created`);
  }
  @AfterUpdate()
  logUpdate() {
    console.log(`! University ${this.id} '${this.name}' updated`);
  }
  @AfterRemove()
  logRemove() {
    console.log(`- University ${this.id} '${this.name}' removed`);
  }
}
