import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../entities';
import { Repository } from 'typeorm';
import { GuildService, UniversityService } from 'src/institutions/services';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private repo: Repository<User>,
    private readonly guildService: GuildService,
    private readonly universityService: UniversityService,
  ) {}

  async create(
    email: string,
    password: string,
    guildId: number,
  ): Promise<User> {
    const user = this.repo.create({ email, password });
    const guild = await this.guildService.findOne(guildId);
    const university = await this.universityService.findOne(1);
    console.log(university.users);
    if (!university) {
      throw new NotFoundException(
        `University with id ${guild.university.id} not found`,
      );
    } else if (!guild) {
      throw new NotFoundException(`Guild with id ${guildId} not found`);
    }
    user.university = university;
    user.guild = guild;
    return this.repo.save(user);
  }

  findOne(id: number): Promise<User> {
    if (!id) {
      return null;
    }
    return this.repo.findOneBy({ id });
  }

  find(email: string): Promise<User[]> {
    return this.repo.find({ where: { email } });
  }

  async update(id: number, attrs: Partial<User>): Promise<User> {
    const user = await this.findOne(id);
    if (!user) {
      throw new NotFoundException('User not found');
    }
    Object.assign(user, attrs);
    return this.repo.save(user);
  }

  async remove(id: number): Promise<void> {
    const user = await this.findOne(id);
    if (!user) {
      throw new NotFoundException('User not found');
    }
    this.repo.remove(user);
  }
}
