import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class ContentClip {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  url: string;
  // When we want to assign tags...
  /* 
  @OneToMany(() => Tag, (tag) => something)
  tags: Tag[];
 */
  /* 
  // If we want to assign all content to a specified guild...
  @ManyToOne(() => Guild, (guild) => guild.content, {
    nullable: false,
    eager: true,
  })
  guild: University;
   */
}
