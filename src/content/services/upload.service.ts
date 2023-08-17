import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Guild, University } from '../../institutions/entities';
import { Repository } from 'typeorm';
import { Content } from '../entities';
import { ContentDto } from '../dto';
import { TagsService } from './tags.service';
import { User } from '../../users/entities';

// TODO: Other modules could rely on filesmodule, not the other way around.
// Figure out how to handle uploading in that manner
@Injectable()
export class UploadService {
  constructor(
    @InjectRepository(Guild)
    private guildRepo: Repository<Guild>,
    @InjectRepository(University)
    private universityRepo: Repository<University>,
    @InjectRepository(Content)
    private contentRepo: Repository<Content>,
    private tagsService: TagsService,
  ) {}

  // TODO: Implement authorization

  async registerUniversityImage(imageUrl: string, id: number): Promise<void> {
    // Register the image for the relevant university repo
    try {
      this.universityRepo.update(id, { imageUrl });
    } catch (e) {
      throw new NotFoundException(
        `Failed to update image for university with id ${id}`,
      );
    }
  }
  async registerGuildImage(imageUrl: string, id: number): Promise<void> {
    // Register the image for the relevant guild repo
    try {
      this.guildRepo.update(id, { imageUrl });
    } catch (e) {
      throw new NotFoundException(
        `Failed to update image for guild with id ${id}`,
      );
    }
  }

  async registerContent(
    url: string,
    { tagIds, title }: ContentDto,
    creator: User,
    type: 'image' | 'clip',
  ): Promise<Content> {
    try {
      const tags = await Promise.all(
        tagIds.map((tag) => {
          return this.tagsService.findTag(tag.id);
        }),
      );
      if (tags.some((tag) => tag === null)) {
        throw new NotFoundException("Couldn't find a tag for the content");
      }
      const content = this.contentRepo.create({
        url,
        title,
        type,
        creator,
        guild: creator.guild,
        profiling: tags.map((tag) => ({ weight: 0.33, tag })), // TODO: Redo weight!!!!
      });
      return await this.contentRepo.save(content);
    } catch (e) {
      console.error(
        `!!! User with id ${
          creator.id
        } failed to create content with title '${title}':\n${JSON.stringify(
          e,
        )}`,
      );
      throw new NotFoundException(
        `Failed to register content with url: ${url}`,
      );
    }
  }
  async registerProfileImage(
    path: string,
    id: number,
    user: User,
  ): Promise<void> {
    // Register the image to the relevant user.
  }
  async registerTagImage(path: string, id: number): Promise<boolean> {
    return this.tagsService.updateImage(path, id);
  }
}
