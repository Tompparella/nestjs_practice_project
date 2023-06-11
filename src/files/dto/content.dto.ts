import { IsString } from 'class-validator';

export class ContentDto {
  @IsString()
  title: string;
  @IsString()
  description: string;
}
