import { IsNumber, IsString } from 'class-validator';

export class CreateGuildDto {
  @IsNumber()
  universityId: string;
  @IsString()
  name: string;
}
