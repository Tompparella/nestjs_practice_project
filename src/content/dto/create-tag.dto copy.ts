import { IsNumber } from 'class-validator';

export class TagImageDto {
  @IsNumber()
  id: number;
}
