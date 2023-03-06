import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { Serialize } from 'src/interceptors/serialize';
import { CreateGuildDto, CreateUniversityDto } from './dto';
import { GuildDto } from './dto/guild.dto';
import { GuildService, UniversityService } from './services';

@Controller('institutions')
//@UseGuards(AuthGuard)
export class InstitutionsController {
  constructor(
    private guildService: GuildService,
    private universityService: UniversityService,
  ) {}
  @Post('/university')
  createUniversity(@Body() body: CreateUniversityDto) {
    return this.universityService.create(body);
  }

  @Post('/guild')
  @Serialize(GuildDto)
  createGuild(@Body() body: CreateGuildDto) {
    return this.guildService.create(body);
  }
}
