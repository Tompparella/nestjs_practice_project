import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { AuthGuard } from 'src/guards';
import { CreateGuildDto, CreateUniversityDto } from './dto';
import { GuildService, UniversityService } from './services';

@Controller('institutions')
@UseGuards(AuthGuard)
export class InstitutionsController {
  constructor(
    private guildService: GuildService,
    private universityService: UniversityService,
  ) {}
  @Post()
  createUniversity(@Body() body: CreateUniversityDto) {
    return this.universityService.create(body);
  }

  @Post()
  createGuild(@Body() body: CreateGuildDto) {
    return this.guildService.create(body);
  }
}
