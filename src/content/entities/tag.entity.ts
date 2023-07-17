import { Content } from './content.entity';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToMany,
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

  @ManyToMany(() => Content, (content) => content.tags)
  content: Content[];

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
