import { Expose, Transform } from 'class-transformer';

export class UserDto {
  @Expose()
  id: number;
  @Expose()
  email: string;
  @Expose()
  @Transform(({ obj }) => obj.profile.username)
  username: string;
  @Expose()
  @Transform(({ obj }) => obj.profile.imageUrl)
  imageUrl: string;
  @Expose()
  @Transform(({ obj }) => obj.guild.id)
  guildId: number;
}
