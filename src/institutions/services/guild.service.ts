import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateGuildDto } from '../dto';
import { Guild } from '../entities';

@Injectable()
export class GuildService {
  constructor(@InjectRepository(Guild) private repo: Repository<Guild>) {}

  create(guildDto: CreateGuildDto) {
    const guild = this.repo.create(guildDto);
    return this.repo.save(guild);
  }
}
