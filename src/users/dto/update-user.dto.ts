import { Transform } from 'class-transformer';
import { IsEmail, IsString, IsOptional, IsNumber } from 'class-validator';

export class UpdateUserDto {
  @IsEmail()
  @IsOptional()
  email: string;

  @IsString()
  @IsOptional()
  username: string;

  @IsString()
  @IsOptional()
  password: string;

  @Transform(({ value }) => parseInt(value, 10))
  @IsNumber()
  @IsOptional()
  guildId: number;
}
