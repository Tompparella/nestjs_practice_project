import { Expose, Transform } from 'class-transformer';
import { Guild } from '../../institutions';
import { User } from '../../users';
import { Tag } from '../../common';

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
  /* @Transform(({ obj }) => {
    try {
      const tagWeight = JSON.parse(obj.tagWeights);
      const weightedTags = obj.tags.map((tag: Tag) => {
        const weight = tagWeight.find((item) => item.id === tag.id).weight;
        return {
          ...tag,
          weight,
        };
      });
      return weightedTags;
    } catch (e) {
      console.error(`!--Failed to parse tag weights for content ${obj.id}`);
      return obj.tags;
    }
  }) */
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
    username: obj.creator.profile.username,
    imageUrl: obj.creator.profile.imageUrl,
  }))
  creator: User;

  @Expose()
  @Transform(({ obj }) => obj.likes?.map((like) => like.id))
  likes: User[];

  @Expose()
  @Transform(({ obj }) => obj.dislikes?.map((like) => like.id))
  dislikes: User[];
}
