import { MiddlewareConsumer, Module } from '@nestjs/common';
import { UsersController } from './users.controller';
import { AuthService, UsersService } from './services';
import { User } from './entities';
import { TypeOrmModule } from '@nestjs/typeorm';
import { InstitutionsModule } from 'src/institutions';
import { CurrentUserMiddleware } from './middleware';

@Module({
  imports: [TypeOrmModule.forFeature([User]), InstitutionsModule],
  controllers: [UsersController],
  providers: [UsersService, AuthService],
})
export class UsersModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(CurrentUserMiddleware).forRoutes('*');
  }
}
