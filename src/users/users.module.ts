import { Module } from '@nestjs/common';
import { UsersController } from './users.controller';
import { AuthService, UsersService } from './services';
import { User } from './entities';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([User])],
  controllers: [UsersController],
  providers: [UsersService, AuthService],
})
export class UsersModule {}
