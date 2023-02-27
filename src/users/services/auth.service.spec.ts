import { BadRequestException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { User } from '../entities';
import { AuthService } from './auth.service';
import { UsersService } from './users.service';

describe('AuthService', () => {
  let service: AuthService;
  let fakeUsersService: Partial<UsersService>;
  beforeEach(async () => {
    fakeUsersService = {
      find: () => Promise.resolve([]),
      create: (email: string, password: string) =>
        Promise.resolve(<User>{ id: 1, email, password }),
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
    fakeUsersService.find = () =>
      Promise.resolve([<User>{ id: 1, email: 'a', password: '1' }]);
    await expect(service.register('asdf@asdf.com', 'asdf')).rejects.toThrow(
      BadRequestException,
    );
  });
});
