import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateGuildDto } from '../dto';
import { Guild } from '../entities';
import { UniversityService } from './university.service';

@Injectable()
export class GuildService {
  constructor(
    @InjectRepository(Guild) private repo: Repository<Guild>,
    private readonly universityService: UniversityService,
  ) {}

  async create(guildDto: CreateGuildDto): Promise<Guild> {
    const uniIdAsNumber = parseInt(guildDto.universityId, 10);
    const guild = this.repo.create({ name: guildDto.name });
    const university = await this.universityService.findOne(uniIdAsNumber);
    guild.university = university;
    return this.repo.save(guild);
  }
  findOne(id: number): Promise<Guild> {
    if (!id) {
      return null;
    }
    return this.repo.findOneBy({ id });
  }
}
