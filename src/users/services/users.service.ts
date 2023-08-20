import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../entities';
import { Repository } from 'typeorm';
import { GuildService } from 'src/institutions/services';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private repo: Repository<User>,
    private guildService: GuildService,
  ) {}

  async create(
    email: string,
    password: string,
    username: string,
    guildId: number,
  ): Promise<User> {
    const user = this.repo.create({ password, email, profile: { username } });
    const guild = await this.guildService.findOne(guildId);
    if (!guild) {
      throw new NotFoundException(`Guild with id ${guildId} not found`);
    }
    user.guild = guild; //TODO: Strip user credentials of all unauthorized characters
    return this.repo.save(user);
  }

  findOne(id: number, relations?: string[]): Promise<User> {
    if (!id) {
      return null;
    }
    return this.repo.findOne({ where: { id }, relations });
  }

  find(email: string): Promise<User[]> {
    return this.repo.find({ where: { email } });
  }

  findByUsername(username: string): Promise<User[]> {
    return this.repo.find({ where: { profile: { username } } });
  }

  async checkUniqueFields(email: string, username: string): Promise<void> {
    //TODO: Tää pitää reworkata
    const usersWithMatchingEmails = await this.find(email);
    if (usersWithMatchingEmails.length > 0) {
      throw new BadRequestException('Email is already in use');
    }
    const usersWithMatchingUsernames = await this.findByUsername(username);
    if (usersWithMatchingUsernames.length > 0) {
      throw new BadRequestException('Username is already in use');
    }
  }

  async update(
    id: number,
    attrs: Omit<Partial<User>, 'password'>,
  ): Promise<User> {
    const user = await this.findOne(id);
    if (!user) {
      throw new NotFoundException('User not found');
    }
    Object.assign(user, attrs);
    return await this.repo.save(user);
  }

  async remove(id: number): Promise<void> {
    const user = await this.findOne(id);
    if (!user) {
      throw new NotFoundException('User not found');
    }
    this.repo.remove(user);
  }
}
