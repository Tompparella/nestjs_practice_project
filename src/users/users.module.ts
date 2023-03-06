import { Module } from '@nestjs/common';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { UsersController } from './users.controller';
import { AuthService, UsersService } from './services';
import { User } from './entities';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CurrentUserInterceptor } from '../interceptors/user';
import { InstitutionsModule } from 'src/institutions';

@Module({
  imports: [TypeOrmModule.forFeature([User]), InstitutionsModule],
  controllers: [UsersController],
  providers: [
    UsersService,
    AuthService,
    { provide: APP_INTERCEPTOR, useClass: CurrentUserInterceptor },
  ],
})
export class UsersModule {}
