import { IsString } from 'class-validator';

export class CreateUniversityDto {
  @IsString()
  name: string;
  @IsString()
  decription: string;
}
