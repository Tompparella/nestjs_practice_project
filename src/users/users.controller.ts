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
} from '@nestjs/common';
import { Serialize } from 'src/interceptors';
import { CreateUserDto, UpdateUserDto, UserDto } from './dto';
import { AuthService, UsersService } from './services';

@Controller('users')
@Serialize(UserDto)
export class UsersController {
  constructor(
    private usersService: UsersService,
    private authService: AuthService,
  ) {}

  @Post('/register')
  createUser(@Body() body: CreateUserDto) {
    this.authService.register(body.email, body.password);
  }

  @Post('/login')
  login(@Body() { email, password }: CreateUserDto) {
    return this.authService.login(email, password);
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

  @Get()
  findAllUsers(@Query('email') email: string) {
    return this.usersService.find(email);
  }

  @Delete('/:id')
  removeUser(@Param('id') id: string) {
    const idAsNumber = parseInt(id, 10);
    return this.usersService.remove(idAsNumber);
  }

  @Patch('/:id')
  updateUser(@Param('id') id: string, @Body() body: UpdateUserDto) {
    const idAsNumber = parseInt(id, 10);
    return this.usersService.update(idAsNumber, body);
  }
}
