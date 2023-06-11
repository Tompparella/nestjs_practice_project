import { Transform } from 'class-transformer';
import { IsNumber } from 'class-validator';

export class ProfileImageDto {
  @Transform(({ value }) => parseInt(value, 10))
  @IsNumber()
  id: number;
}
