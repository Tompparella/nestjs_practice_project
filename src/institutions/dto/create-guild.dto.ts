import { Transform } from 'class-transformer';
import { IsNumber, IsString } from 'class-validator';

export class CreateGuildDto {
  @IsString()
  name: string;

  @IsString()
  description: string;

  @Transform(({ value }) => parseInt(value, 10))
  @IsNumber()
  universityId: number;
}
