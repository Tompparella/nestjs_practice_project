import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { University } from '../entities';
import { Repository, In } from 'typeorm';
import { CreateUniversitiesDto, CreateUniversityDto } from '../dto';

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
  async createMany(
    universitiesDto: CreateUniversitiesDto,
  ): Promise<University[]> {
    const { names, descriptions } = universitiesDto;
    if (names.length !== descriptions.length) {
      throw new BadRequestException(
        'Amount of names and descriptions is not the same',
      );
    }
    await Promise.all(names.map((name) => this.checkUniqueFields(name)));
    const universities = names.map((name, index) => {
      const newUniversity = {
        name,
        description: descriptions[index],
      };
      return this.repo.create(newUniversity);
    });
    return await this.repo.save(universities);
  }
  find(universityIds?: number[]): Promise<University[]> {
    if (universityIds) {
      return this.repo.find({ where: { id: In(universityIds) } });
    } else {
      return this.repo.find();
    }
  }
  findOne(id: number): Promise<University> {
    if (!id) {
      return null;
    }
    return this.repo.findOne({ where: { id } }); // {relations: ['guilds']}
  }
}
