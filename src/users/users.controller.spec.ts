import { NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { User } from './entities';
import { AuthService, UsersService } from './services';
import { UsersController } from './users.controller';

const testId = 1;
const testEmail = 'test@mail.com';
const testPassword = 'passwordTest1234!';

describe('UsersController', () => {
  let controller: UsersController;
  let fakeUsersService: Partial<UsersService>;
  let fakeAuthService: Partial<AuthService>;

  beforeEach(async () => {
    const users: User[] = [
      <User>{ id: testId, email: testEmail, password: testPassword },
    ];
    fakeUsersService = {
      findOne: (id: number) =>
        Promise.resolve(users.find((user) => user.id === id)),
      find: (email: string) =>
        Promise.resolve(users.filter((user) => user.email === email)),
      /* remove: (id: string) =>
        Promise.resolve(users.some((user) => user.id === parseInt(id, 10))),
      update: () => {}, */
    };
    fakeAuthService = {
      register: (email: string, password: string) => {
        const user = <User>{
          id: 2,
          email,
          password,
        };
        users.push(user);
        return Promise.resolve(user);
      },
      login: (email: string, password: string) => {
        const user = users.find(
          (user) => user.email === email && user.password === password,
        );
        return Promise.resolve(user);
      },
    };
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [
        {
          provide: UsersService,
          useValue: fakeUsersService,
        },
        {
          provide: AuthService,
          useValue: fakeAuthService,
        },
      ],
    }).compile();

    controller = module.get<UsersController>(UsersController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
  it('findAllUsers returns a list of all users with given email', async () => {
    const users = await controller.findAllUsers(testEmail);
    expect(users.length).toEqual(1);
    expect(users[0].email).toEqual(testEmail);
  });
  it('findOne finds one user by id', async () => {
    const user = await controller.findUser(testId.toString());
    expect(user).toBeDefined();
    expect(user.email).toEqual(testEmail);
  });
  it("findUser throws error if user with id isn't found", async () => {
    await expect(controller.findUser('0')).rejects.toThrow(NotFoundException);
  });
  it('signin updates session object and returns user', async () => {
    const session = { userId: -1 };
    const user = await controller.login(
      {
        email: testEmail,
        password: testPassword,
      },
      session,
    );
    expect(user.id).toEqual(testId);
    expect(session.userId).toEqual(testId);
  });
  it('logout sets session token to null', async () => {
    const session = { userId: testId };
    controller.logout(session);
    expect(session.userId).toEqual(null);
  });
});
