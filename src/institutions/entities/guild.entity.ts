import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Guild {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;
}
