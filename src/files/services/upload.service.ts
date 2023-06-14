import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Guild, University } from 'src/institutions';
import { Repository } from 'typeorm';
import { ContentClip, ContentImage } from '../entities';
import { ContentClipDto, ContentImageDto } from '../dto';

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
  ): Promise<void> {
    // Register the content to the image repo, as well as the relevant institution- and user repo
  }
  async registerContentClip(path: string, data: ContentClipDto): Promise<void> {
    // Register the content to the clip repo, as well as the relevant institution- and user repo
  }
  async registerProfileImage(path: string, id: number): Promise<void> {
    // Register the image to the relevant user.
  }
}
