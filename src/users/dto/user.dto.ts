import { Expose, Transform } from 'class-transformer';
import { Profile } from '../entities';

export class UserDto {
  @Expose()
  id: number;

  @Expose()
  email: string;

  @Expose()
  @Transform(({ obj }) => obj.profile)
  profile: Profile;

  @Expose()
  @Transform(({ obj }) => obj.guild.id)
  guildId: number;

  @Expose()
  created_at: Date;

  @Expose()
  updated_at: Date;
}
