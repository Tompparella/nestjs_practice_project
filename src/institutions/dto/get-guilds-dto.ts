import { Transform } from 'class-transformer';
import { IsNumber } from 'class-validator';

export class GetGuildsDto {
  @Transform(({ value }) => parseInt(value, 10))
  @IsNumber()
  universityId: number;
}
