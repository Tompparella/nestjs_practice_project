import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { AdminGuard, AuthGuard } from 'src/guards';
import { Serialize } from 'src/interceptors';
import {
  CreateGuildDto,
  CreateUniversitiesDto,
  CreateUniversityDto,
  GetGuildsDto,
} from './dto';
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
  //@UseGuards(AdminGuard, AuthGuard) //TODO: Remove guard-blocking comments!
  createUniversity(@Body() body: CreateUniversityDto) {
    return this.universityService.create(body);
  }

  @Post(`${Institution.University}-many`)
  //@UseGuards(AdminGuard, AuthGuard) //TODO: Remove guard-blocking comments!
  createUniversities(@Body() body: CreateUniversitiesDto) {
    return this.universityService.createMany(body);
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

  @Delete(Institution.Guild)
  //@UseGuards(AdminGuard, AuthGuard)
  removeGuild() {
    //TODO: Remove route
    return;
  }

  @Delete(Institution.University)
  //@UseGuards(AdminGuard, AuthGuard)
  removeUniversity() {
    //TODO: Remove route
    return;
  }
}
