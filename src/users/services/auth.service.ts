import {
  Injectable,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import { randomBytes, scrypt as _scrypt } from 'crypto';
import { promisify } from 'util';
import { UsersService } from './users.service';

const scrypt = promisify(_scrypt);

@Injectable()
export class AuthService {
  constructor(private usersService: UsersService) {}

  async register(authObject: {
    email: string;
    username: string;
    password: string;
    guildId: number;
  }) {
    const { email, username, password, guildId } = authObject;
    await this.usersService.checkUniqueFields(email, username);
    const salt = randomBytes(16).toString('hex');
    const hash = <Buffer>await scrypt(password, salt, 32);
    const result = `${salt}.${hash.toString('hex')}`;
    const user = this.usersService.create(email, result, username, guildId);
    return user;
  }

  async login(email: string, password: string) {
    const [user] = await this.usersService.find(email);
    if (!user) {
      throw new NotFoundException('User not found');
    }
    const [salt, storedHash] = user.password.split('.');
    const hash = <Buffer>await scrypt(password, salt, 32);
    if (hash.toString('hex') === storedHash) {
      return user;
    } else {
      throw new BadRequestException('Invalid authentication credentials');
    }
  }
}
