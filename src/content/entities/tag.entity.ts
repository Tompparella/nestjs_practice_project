import { Content } from './content.entity';
import { Entity, PrimaryGeneratedColumn, Column, ManyToMany } from 'typeorm';

@Entity()
export class Tag {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  name: string;

  @Column()
  description: string;

  @Column()
  imageUrl: string;

  @ManyToMany(() => Content, (content) => content.tags)
  content: Content[];
}
