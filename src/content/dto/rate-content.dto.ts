import { Transform } from 'class-transformer';
import { IsNumber, IsString } from 'class-validator';

export class RateContentDto {
  @Transform(({ value }) => parseInt(value, 10))
  @IsNumber()
  contentId: number;
  @IsString()
  rating: 'like' | 'dislike';
}
