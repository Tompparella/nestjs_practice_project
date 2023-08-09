import { Transform, Type } from 'class-transformer';
import { ArrayMaxSize, ArrayMinSize, IsArray, IsString } from 'class-validator';

export type TagWeight = {
  id: number;
  weight: number;
};

export class ContentDto {
  @IsArray()
  @Type(() => Object)
  @ArrayMinSize(1)
  @ArrayMaxSize(3)
  @Transform(
    ({ obj }) =>
      obj.tagIds?.map((tag) => ({
        id: Number(tag.id),
        weight: Number(tag.weight),
      })),
  )
  tagIds: TagWeight[];

  @IsString()
  title: string;
}
