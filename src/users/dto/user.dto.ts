import { Expose, Transform } from 'class-transformer';

export class UserDto {
  @Expose()
  id: number;
  @Expose()
  email: string;

  @Transform(({ obj }) => obj.university.id)
  @Expose()
  universityId: number;

  @Transform(({ obj }) => obj.guild.id)
  @Expose()
  guildId: number;
}
