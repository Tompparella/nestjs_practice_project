import { Type } from 'class-transformer';
import { ArrayMaxSize, ArrayMinSize, IsArray, IsString } from 'class-validator';

export class ContentDto {
  @IsArray()
  @Type(() => Number)
  @ArrayMinSize(1)
  @ArrayMaxSize(3)
  tagIds: number[];

  @IsString()
  title: string;
}
