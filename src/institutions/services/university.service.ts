import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { University } from '../entities';
import { Repository } from 'typeorm';
import { CreateUniversityDto } from '../dto';

@Injectable()
export class UniversityService {
  constructor(
    @InjectRepository(University) private repo: Repository<University>,
  ) {}

  create(universityDto: CreateUniversityDto): Promise<University> {
    const university = this.repo.create(universityDto);
    return this.repo.save(university);
  }
}
