import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In } from 'typeorm';
import { CreateTagDto, CreateTagsDto } from '../dto';
import { Tag } from '../../common';

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

  async createTags(tags: CreateTagsDto) {
    const { names, descriptions } = tags;
    const arrayLength = names.length;
    if (arrayLength !== descriptions.length) {
      throw new BadRequestException(
        'Length of names and descriptions is not the same',
      );
    }
    const tagExists = await this.repo.exist({ where: { name: In(names) } });
    if (tagExists) {
      throw new BadRequestException('A tag with the same name already exists');
    }
    const tagObjects = tags.names.map((name, index) => ({
      name,
      description: descriptions[index],
    }));
    const createdTag = this.repo.create(tagObjects);
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

  clear() {
    return this.repo.clear();
  }
}
