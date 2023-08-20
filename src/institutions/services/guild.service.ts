import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Guild } from '../entities';
import { UniversityService } from './university.service';
import { CreateGuildDto, CreateGuildsDto } from '../dto';

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

  async create(guildObject: CreateGuildDto): Promise<Guild> {
    const { name, description, universityId } = guildObject;
    await this.checkUniqueFields(name);
    const guild = this.repo.create({ name, description });
    const university = await this.universityService.findOne(universityId);
    if (!university) {
      throw new BadRequestException(
        'University to which the guild associates to not found',
      );
    }
    guild.university = university;
    return await this.repo.save(guild);
  }
  async createMany(guildsDto: CreateGuildsDto): Promise<Guild[]> {
    const { names, descriptions, universityIds } = guildsDto;
    const arrayLength = names.length;
    if (
      arrayLength !== descriptions.length ||
      arrayLength !== universityIds.length
    ) {
      throw new BadRequestException(
        'Amount of names, descriptions, and universityIds is not the same',
      );
    }
    await Promise.all(names.map((name) => this.checkUniqueFields(name)));
    const guildObjects = names.map((name, index) => ({
      name,
      description: descriptions[index],
      university: universityIds[index],
    }));
    const universities = await this.universityService.find(universityIds);
    const guilds: Guild[] = guildObjects.map((guild) => {
      const newUniversity = {
        ...guild,
        university: universities.find((uni) => uni.id === guild.university),
      };
      return this.repo.create(newUniversity);
    });
    return await this.repo.save(guilds);
  }
  find(universityId: number): Promise<Guild[]> {
    return this.repo.findBy({ university: { id: universityId } });
  }
  findOne(id: number, relations?: string[]): Promise<Guild> {
    if (!id) {
      return null;
    }
    return this.repo.findOne({ where: { id }, relations });
  }
}
