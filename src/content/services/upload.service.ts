import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Guild, University } from '../../institutions/entities';
import { Repository } from 'typeorm';
import { ContentClip, ContentImage } from '../entities';
import { ContentClipDto, ContentImageDto } from '../dto';
import { UsersService } from '../../users/services';
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
    @InjectRepository(ContentImage)
    private imageRepo: Repository<ContentImage>,
    @InjectRepository(ContentClip)
    private clipRepo: Repository<ContentClip>,
    private usersService: UsersService,
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

  async registerContentImage(
    path: string,
    data: ContentImageDto,
    user: User,
  ): Promise<ContentImage> {
    //Let usersService handle registering the image to other repos, then register the content to the image repo
    try {
      const content = this.imageRepo.create({
        url: path,
        title: data.title,
        type: 'image',
        creator: user,
        tags: [],
        guild: user.guild,
      });
      console.log(content);
      this.usersService.uploadContent(user, content);
      return content;
    } catch (e) {
      throw new NotFoundException(
        `Failed to register content with url: ${path}`,
      );
    }
  }
  async registerContentClip(
    path: string,
    data: ContentClipDto,
    user: User,
  ): Promise<void> {
    //Let usersService handle registering the clip to other repos, then register the content to the image repo
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
