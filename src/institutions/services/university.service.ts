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

  async create(universityDto: CreateUniversityDto): Promise<University> {
    try {
      const university = this.repo.create(universityDto);
      return await this.repo.save(university);
    } catch (e) {
      throw new Error(`Failed to create guild entry: ${e}`);
    }
  }
  findOne(id: number): Promise<University> {
    if (!id) {
      return null;
    }
    return this.repo.findOne({ where: { id } }); // {relations: ['guilds']}
  }
}
