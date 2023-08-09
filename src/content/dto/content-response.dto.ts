import { Expose, Transform } from 'class-transformer';
import { Guild } from '../../institutions';
import { Tag } from '../entities';
import { User } from 'src/users';

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
  @Transform(({ obj }) => {
    try {
      /* const p1 = performance.now(); */
      const tagWeight = JSON.parse(obj.tagWeights);
      const weightedTags = obj.tags.map((tag: Tag) => {
        const weight = tagWeight.find((item) => item.id === tag.id).weight;
        return {
          ...tag,
          weight,
        };
      });
      /* const p2 = performance.now();
      console.debug(`${p2 - p1} ms`); */
      return weightedTags;
    } catch (e) {
      console.error(`!--Failed to parse tag weights for content ${obj.id}`);
      return obj.tags;
    }
  })
  tags: Tag[];
  /* 
  @Expose()
  @Transform(({ obj }) => JSON.parse(obj.tagWeights))
  tagWeights: TagWeight[];
 */
  @Expose()
  @Transform(({ obj }) => obj.guild)
  guild: Guild;

  //  Can look into exposing guild once switching between institutions is made possible
  @Expose()
  @Transform(({ obj }) => ({
    id: obj.creator.id,
    username: obj.creator.username,
    imageUrl: obj.creator.imageUrl,
  }))
  creator: User;

  @Expose()
  @Transform(({ obj }) => obj.likes.map((like) => like.id))
  likes: User[];

  @Expose()
  @Transform(({ obj }) => obj.likes.map((like) => like.id))
  dislikes: User[];
}
