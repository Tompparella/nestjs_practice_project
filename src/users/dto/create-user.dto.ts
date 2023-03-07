import { Transform } from 'class-transformer';
import { IsEmail, IsNumber, IsString } from 'class-validator';

export class CreateUserDto {
  @IsEmail()
  email: string;

  @IsString()
  username: string;

  @IsString()
  password: string;

  @Transform(({ value }) => parseInt(value, 10))
  @IsNumber()
  guildId: number;
}
