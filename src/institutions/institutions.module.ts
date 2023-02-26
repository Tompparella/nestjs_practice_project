import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { University } from './entities';
import { InstitutionsController } from './institutions.controller';
import { UniversityService } from './services';

@Module({
  imports: [TypeOrmModule.forFeature([University])],
  controllers: [InstitutionsController],
  providers: [UniversityService],
})
export class InstitutionsModule {}
