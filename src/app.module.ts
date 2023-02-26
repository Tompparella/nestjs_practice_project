import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule, User } from './users';
import { InstitutionsModule, University, Guild } from './institutions';
import { ContentModule } from './content/content.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { InstitutionsController } from './institutions/institutions.controller';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'sqlite',
      database: 'db.sqlite',
      entities: [User, University, Guild],
      synchronize: true, // !! DO NOT LEAVE TRUE IN PRODUCTION FOR FUCKS SAKE !!
    }),
    UsersModule,
    InstitutionsModule,
    ContentModule,
  ],
  controllers: [AppController, InstitutionsController],
  providers: [AppService],
})
export class AppModule {}
