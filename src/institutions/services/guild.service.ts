import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Guild } from '../entities';
import { UniversityService } from './university.service';

@Injectable()
export class GuildService {
  constructor(
    @InjectRepository(Guild) private repo: Repository<Guild>,
    private readonly universityService: UniversityService,
  ) {}

  async checkUniqueFields(name: string): Promise<void> {
    const matchingNames = await this.repo.find({ where: { name } });
    if (matchingNames.length > 0) {
      throw new BadRequestException('Guild with that name already exists');
    }
  }

  async create(guildObject: {
    name: string;
    universityId: number;
  }): Promise<Guild> {
    const { name, universityId } = guildObject;
    await this.checkUniqueFields(name);
    const guild = this.repo.create({ name });
    const university = await this.universityService.findOne(universityId);
    if (!university) {
      throw new BadRequestException(
        'University to which the guild associates to not found',
      );
    }
    guild.university = university;
    return await this.repo.save(guild);
  }
  find(universityId: number): Promise<Guild[]> {
    return this.repo.findBy({ university: { id: universityId } });
  }
  findOne(id: number): Promise<Guild> {
    if (!id) {
      return null;
    }
    return this.repo.findOneBy({ id });
  }
}
