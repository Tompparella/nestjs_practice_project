import { Expose, Transform } from 'class-transformer';

export class UserDto {
  @Expose()
  id: number;
  @Expose()
  email: string;
  @Expose()
  username: string;
  @Expose()
  imageUrl: string;
  @Expose()
  @Transform(({ obj }) => obj.guild.id)
  guildId: number;
}
