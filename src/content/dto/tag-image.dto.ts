import { IsNumber } from 'class-validator';
import { Transform } from 'class-transformer';

export class TagImageDto {
  @Transform(({ value }) => parseInt(value, 10))
  @IsNumber()
  id: number;
}
