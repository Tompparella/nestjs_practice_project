import { Expose, Transform } from 'class-transformer';
import { University } from '../entities';

export class GuildDto {
  @Expose()
  id: number;

  @Expose()
  name: string;

  @Expose()
  imageUrl: string;

  @Expose()
  @Transform(({ obj }) => obj.university)
  university: University;
}
