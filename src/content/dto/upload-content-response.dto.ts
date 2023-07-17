import { Expose, Transform } from 'class-transformer';
import { Guild } from '../../institutions';
import { Tag } from '../entities';

export class UploadContentResponseDto {
  @Expose()
  id: number;
  @Expose()
  url: string;
  @Expose()
  title: string;
  @Expose()
  @Transform(({ obj }) => obj.tags.map((tag: Tag) => tag))
  tags: Tag[];
  @Expose()
  @Transform(({ obj }) => obj.creator.guild)
  guild: Guild;
}
