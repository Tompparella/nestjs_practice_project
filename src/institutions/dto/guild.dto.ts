import { Expose, Transform } from 'class-transformer';

export class GuildDto {
  @Expose()
  id: number;

  @Expose()
  name: string;

  @Expose()
  imageUrl: string;

  @Expose()
  @Transform(({ obj }) => obj.university.id)
  universityId: number;
}
