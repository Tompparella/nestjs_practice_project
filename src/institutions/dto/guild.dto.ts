import { Expose, Transform } from 'class-transformer';
import { University } from '../entities';

export class GuildDto {
  @Expose()
  id: number;

  @Expose()
  name: string;

  @Expose()
  description: string;

  @Expose()
  imageUrl: string;

  @Expose()
  @Transform(({ obj }) => obj.university)
  university: University;

  @Expose()
  created_at: Date;

  @Expose()
  updated_at: Date;
}
