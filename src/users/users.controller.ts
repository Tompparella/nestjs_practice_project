import {
  Body,
  Controller,
  Post,
  Get,
  Patch,
  Param,
  Query,
  Delete,
  NotFoundException,
  Session,
  UseGuards,
} from '@nestjs/common';
import { AdminGuard, AuthGuard } from '../guards';
import { Serialize } from '../interceptors';
import { CurrentUser } from './decorators';
import { CreateUserDto, LoginUserDto, UpdateUserDto, UserDto } from './dto';
import { User } from './entities';
import { AuthService, UsersService } from './services';

enum Path {
  WhoAmI = '/whoami',
  Register = '/register',
  Login = '/login',
  Logout = '/logout',
}

@Controller('users')
@Serialize(UserDto)
export class UsersController {
  constructor(
    private usersService: UsersService,
    private authService: AuthService,
  ) {}

  @Get(Path.WhoAmI)
  @UseGuards(AuthGuard)
  whoAmI(@CurrentUser() user: User) {
    return user;
  }

  @Post(Path.Register)
  async register(@Body() body: CreateUserDto, @Session() session: any) {
    const user = await this.authService.register(body);
    session.userId = user.id;
    return user;
  }

  @Post(Path.Login)
  async login(
    @Body() { email, password }: LoginUserDto,
    @Session() session: any,
  ) {
    const user = await this.authService.login(email, password);
    session.userId = user.id;
    return user;
  }

  @Post(Path.Logout)
  logout(@Session() session: any) {
    session.userId = null;
  }

  @Get('/:id')
  async findUser(@Param('id') id: string) {
    const idAsNumber = parseInt(id, 10);
    const user = await this.usersService.findOne(idAsNumber);
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return user;
  }

  @UseGuards(AdminGuard)
  @Get()
  findAllUsers(@Query('email') email: string) {
    return this.usersService.find(email);
  }

  @UseGuards(AdminGuard)
  @Delete('/:id')
  removeUser(@Param('id') id: string) {
    const idAsNumber = parseInt(id, 10);
    return this.usersService.remove(idAsNumber);
  }

  // TODO: Add Administration/Moderator/Own verification!
  @UseGuards(AdminGuard)
  @Patch('/:id')
  updateUser(@Param('id') id: string, @Body() body: UpdateUserDto) {
    const idAsNumber = parseInt(id, 10);
    return this.usersService.update(idAsNumber, body);
  }
}
