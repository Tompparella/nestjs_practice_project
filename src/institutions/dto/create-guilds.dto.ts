import { Type, Transform } from 'class-transformer';
import { IsArray } from 'class-validator';

export class CreateGuildsDto {
  @IsArray()
  @Type(() => String)
  names: string[];

  @IsArray()
  @Type(() => String)
  descriptions: string[];

  @Transform(({ obj }) =>
    obj.universityIds?.map((value) => parseInt(value, 10)),
  )
  @IsArray()
  universityIds: number[];
}
