import { Entity } from 'typeorm';
import { Content } from './content.entity';

@Entity()
export class ContentClip extends Content {}
