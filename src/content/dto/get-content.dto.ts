import { Transform } from 'class-transformer';
import { IsNumber, IsOptional } from 'class-validator';

export class GetContentDto {
  @IsOptional()
  @Transform(({ value }) => parseInt(value, 10))
  @IsNumber()
  guildId: number;

  @IsOptional()
  @Transform(({ value }) => parseInt(value, 10))
  @IsNumber()
  universityId: number;

  @Transform(({ value }) => parseInt(value, 10))
  @IsNumber()
  index = 0;
}
