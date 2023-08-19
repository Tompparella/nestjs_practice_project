import {
  Entity,
  PrimaryGeneratedColumn,
  AfterInsert,
  AfterUpdate,
  AfterRemove,
  Column,
  OneToOne,
  OneToMany,
} from 'typeorm';
import { UserProfiling } from './user-profiling.entity';
import { User } from './user.entity';
import { Base } from '../../common';

@Entity()
export class Profile extends Base {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  username: string;

  @Column({ nullable: true })
  imageUrl: string;

  @Column({ nullable: true })
  description: string;

  @OneToMany(() => UserProfiling, (profiling) => profiling.profile, {
    cascade: true,
  })
  profiling: UserProfiling[];

  @OneToOne(() => User, (user) => user.profile)
  user: User;

  @AfterInsert()
  logInsert() {
    console.log(`+ Created profile ${this.username} with id ${this.id}`);
  }
  @AfterUpdate()
  logUpdate() {
    console.log(
      `! Updated profile ${this.username} for user id ${this.user.id}`,
    );
  }
  @AfterRemove()
  logRemove() {
    console.log(
      `- Removed profile ${this.username} for user id ${this.user.id}`,
    );
  }
}
