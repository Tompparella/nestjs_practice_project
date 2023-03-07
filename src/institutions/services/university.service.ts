import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { University } from '../entities';
import { Repository } from 'typeorm';
import { CreateUniversityDto } from '../dto';

@Injectable()
export class UniversityService {
  constructor(
    @InjectRepository(University) private repo: Repository<University>,
  ) {}

  async checkUniqueFields(name: string): Promise<void> {
    const matchingNames = await this.repo.find({ where: { name } });
    if (matchingNames.length > 0) {
      throw new BadRequestException('University with that name already exists');
    }
  }

  async create(universityDto: CreateUniversityDto): Promise<University> {
    await this.checkUniqueFields(universityDto.name);
    const university = this.repo.create(universityDto);
    return await this.repo.save(university);
  }
  find(): Promise<University[]> {
    return this.repo.find();
  }
  findOne(id: number): Promise<University> {
    if (!id) {
      return null;
    }
    return this.repo.findOne({ where: { id } }); // {relations: ['guilds']}
  }
}
