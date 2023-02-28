import { IsEmail, IsString } from 'class-validator';

export class CreateUniversityDto {
  @IsString()
  name: string;
}
