import { Transform } from 'class-transformer';
import { IsNumber, IsString } from 'class-validator';

export class InstitutionImageDto {
  @IsString()
  type: 'guild' | 'university';
  @Transform(({ value }) => parseInt(value, 10))
  @IsNumber()
  id: number;
}
