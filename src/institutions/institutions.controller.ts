import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { AdminGuard, AuthGuard } from 'src/guards';
import { Serialize } from 'src/interceptors';
import { CreateGuildDto, CreateUniversityDto } from './dto';
import { GuildDto } from './dto/guild.dto';
import { GuildService, UniversityService } from './services';

@Controller('institutions')
/* @UseGuards(AuthGuard) */
export class InstitutionsController {
  constructor(
    private guildService: GuildService,
    private universityService: UniversityService,
  ) {}
  @Post('/university')
  /*  @UseGuards(AdminGuard) */
  createUniversity(@Body() body: CreateUniversityDto) {
    return this.universityService.create(body);
  }

  @Post('/guild')
  @Serialize(GuildDto)
  /*   @UseGuards(AdminGuard) */
  createGuild(@Body() body: CreateGuildDto) {
    return this.guildService.create(body);
  }
}
