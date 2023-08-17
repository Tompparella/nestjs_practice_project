import { ContentProfiling } from '../../content/entities';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
  AfterInsert,
  AfterUpdate,
  AfterRemove,
} from 'typeorm';

@Entity()
export class Tag {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  name: string;

  @Column()
  description: string;

  @Column({ nullable: true })
  imageUrl: string;

  @OneToMany(() => ContentProfiling, (profiling) => profiling.tag)
  contentProfiles: ContentProfiling[];

  @AfterInsert()
  logInsert() {
    console.log(`+ Created tag with id ${this.id}`);
  }
  @AfterUpdate()
  logUpdate() {
    console.log(`! Updated tag with id ${this.id}`);
  }
  @AfterRemove()
  logRemove() {
    console.log(`- Removed tag with id ${this.id}`);
  }
}
