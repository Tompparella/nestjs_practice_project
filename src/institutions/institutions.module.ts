import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { University } from './entities';
import { InstitutionsController } from './institutions.controller';
import { GuildService, UniversityService } from './services';

@Module({
  imports: [TypeOrmModule.forFeature([University])],
  controllers: [InstitutionsController],
  providers: [UniversityService, GuildService],
})
export class InstitutionsModule {}
