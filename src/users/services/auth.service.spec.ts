import { BadRequestException, NotFoundException } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { User } from '../entities';
import { AuthService } from './auth.service';
import { UsersService } from './users.service';

describe('AuthService', () => {
  let service: AuthService;
  let fakeUsersService: Partial<UsersService>;
  beforeEach(async () => {
    const users: User[] = [];
    fakeUsersService = {
      find: (email: string) => {
        const filteredUsers = users.filter((user) => user.email === email);
        return Promise.resolve(filteredUsers);
      },
      create: (email: string, password: string) => {
        const user = <User>{ id: users.length, email, password };
        users.push(user);
        return Promise.resolve(user);
      },
    };
    const module = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: UsersService,
          useValue: fakeUsersService,
        },
      ],
    }).compile();
    service = module.get(AuthService);
  });

  it('can create an instance of auth service', async () => {
    // Create a fake copy of UsersService
    expect(service).toBeDefined();
  });

  it('creates a new user with salted + hashed password', async () => {
    const user = await service.register(
      'kdsaj@gmail.com',
      'dohnfducjahenrfikuj',
    );
    expect(user.password).not.toEqual('dohnfducjahenrfikuj');
    const [salt, hash] = user.password.split('.');
    expect(salt).toBeDefined();
    expect(hash).toBeDefined();
  });

  it('throws an error if user signs up with email that is in use', async () => {
    await service.register('asdf@asdf.com', 'asdf');
    await expect(service.register('asdf@asdf.com', 'asdf')).rejects.toThrow(
      BadRequestException,
    );
  });

  it('throws if login in called with an unused email', async () => {
    await expect(
      service.login('test@mail.com', 'passwordTest123!'),
    ).rejects.toThrow(NotFoundException);
  });

  it('throws if an invalid password is provided', async () => {
    await service.register('test@mail.com', 'passwordTest123!');
    await expect(
      service.login('test@mail.com', 'notTestPassword4321?'),
    ).rejects.toThrow(BadRequestException);
  });

  it('returns a user if password is correct', async () => {
    await service.register('test@mail.com', 'passwordTest1234!');
    const user = await service.login('test@mail.com', 'passwordTest1234!');
    expect(user).toBeDefined();
  });
});
