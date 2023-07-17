import { Type } from 'class-transformer';
import { IsArray } from 'class-validator';

export class CreateUniversitiesDto {
  @IsArray()
  @Type(() => String)
  names: string[];
}
