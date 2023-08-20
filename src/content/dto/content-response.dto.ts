import { Expose, Transform } from 'class-transformer';
import { Guild } from '../../institutions';
import { User } from '../../users';
import { ContentProfiling } from '../entities';

export class ContentResponseDto {
  @Expose()
  id: number;

  @Expose()
  url: string;

  @Expose()
  title: string;

  @Expose()
  type: 'image' | 'clip';

  @Expose()
  @Transform(({ obj }) => obj.profiling?.map((profiling) => profiling))
  profiling: ContentProfiling[];

  @Expose()
  @Transform(({ obj }) => obj.guild)
  guild: Guild;

  //  Can look into exposing guild once switching between institutions is made possible
  @Expose()
  @Transform(({ obj }) => {
    console.log(obj.creator);
    return {
      id: obj.creator.id,
      profile: obj.creator.profile,
    };
  })
  creator: User;

  @Expose()
  @Transform(({ obj }) => obj.likes?.map((like) => like.id))
  likes: User[];

  @Expose()
  @Transform(({ obj }) => obj.dislikes?.map((like) => like.id))
  dislikes: User[];

  @Expose()
  created_at: Date;

  @Expose()
  updated_at: Date;
}
