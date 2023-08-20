import { Type } from 'class-transformer';
import { IsArray } from 'class-validator';

export class CreateTagsDto {
  @IsArray()
  @Type(() => String)
  names: string[];

  @IsArray()
  @Type(() => String)
  descriptions: string[];
}
