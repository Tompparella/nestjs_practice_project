import {
  BadRequestException,
  Body,
  Controller,
  Get,
  Param,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { AdminGuard, AuthGuard } from 'src/guards';
import { Serialize } from 'src/interceptors';
import { CreateGuildDto, CreateUniversityDto, GetGuildsDto } from './dto';
import { GuildDto } from './dto/guild.dto';
import { GuildService, UniversityService } from './services';

enum Institution {
  University = '/universities',
  Guild = '/guilds',
}

@Controller('institutions')
export class InstitutionsController {
  constructor(
    private guildService: GuildService,
    private universityService: UniversityService,
  ) {}

  @Get(Institution.University)
  findUniversities() {
    return this.universityService.find();
  }

  @Get(`${Institution.University}/:id`)
  @UseGuards(AuthGuard)
  findUniversity(@Param('id') id: string) {
    const idAsNumber = parseInt(id, 10);
    if (idAsNumber < 0) {
      throw new BadRequestException('Invalid university id');
    }
    return this.universityService.findOne(idAsNumber);
  }

  @Post(Institution.University)
  //@UseGuards(AdminGuard, AuthGuard)
  createUniversity(@Body() body: CreateUniversityDto) {
    return this.universityService.create(body);
  }

  @Get(`${Institution.Guild}/:id`)
  @Serialize(GuildDto)
  @UseGuards(AuthGuard)
  findGuild(@Param('id') id: string) {
    const idAsNumber = parseInt(id, 10);
    if (idAsNumber < 0) {
      throw new BadRequestException('Invalid guild id');
    }
    return this.guildService.findOne(idAsNumber);
  }

  @Get(Institution.Guild)
  @Serialize(GuildDto)
  findGuildsByUniversity(@Query() query: GetGuildsDto) {
    return this.guildService.find(query.universityId);
  }

  @Post(Institution.Guild)
  @Serialize(GuildDto)
  //@UseGuards(AdminGuard, AuthGuard)
  createGuild(@Body() body: CreateGuildDto) {
    return this.guildService.create(body);
  }
}
