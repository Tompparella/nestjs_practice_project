import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Tag } from '../entities';
import { CreateTagDto } from '../dto';

@Injectable()
export class TagsService {
  constructor(@InjectRepository(Tag) private repo: Repository<Tag>) {}

  async createTag(tag: CreateTagDto) {
    return this.repo.create(tag);
  }

  async updateImage(path: string, id: number) {
    return Boolean(this.repo.update(id, { imageUrl: path }));
  }

  async findTag(id: number) {
    return this.repo.findOneBy({ id });
  }
}
