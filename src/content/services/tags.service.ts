import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Tag } from '../entities';
import { CreateTagDto } from '../dto';

@Injectable()
export class TagsService {
  constructor(@InjectRepository(Tag) private repo: Repository<Tag>) {}

  async createTag(tag: CreateTagDto) {
    const existingTag = await this.repo.findBy({ name: tag.name });
    if (existingTag.length > 0) {
      throw new BadRequestException('A tag with the same name already exists');
    }
    const createdTag = this.repo.create(tag);
    return this.repo.save(createdTag);
  }

  async updateImage(path: string, id: number) {
    return Boolean(this.repo.update(id, { imageUrl: path }));
  }

  async findTag(id: number) {
    return this.repo.findOneBy({ id });
  }

  async getTags() {
    return this.repo.find();
  }
}
