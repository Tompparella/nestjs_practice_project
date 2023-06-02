import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Guild, University } from 'src/institutions';
import { Repository } from 'typeorm';
import { GuildService, UniversityService } from 'src/institutions/services';
import { ContentClip, ContentImage } from '../entities';

// TODO: Other modules could rely on filesmodule, not the other way around.
// Figure out how to handle uploading in that manner
@Injectable()
export class UploadService {
  constructor(
    /* @InjectRepository(Guild)
    private guildRepo: Repository<Guild>,
    @InjectRepository(University)
    private universityRepo: Repository<University>, */
    @InjectRepository(ContentImage)
    private imageRepo: Repository<ContentImage>,
    @InjectRepository(ContentClip)
    private clipRepo: Repository<ContentClip> /* private readonly universityService: UniversityService,
    private readonly guildService: GuildService, */,
  ) {}
  async registerInstitutionImage(path: string): Promise<void> {
    // Register the image for the relevant institution repo
  }
  async registerContentImage(path: string): Promise<void> {
    // Register the content to the image repo, as well as the relevant institution- and user repo
  }
  async registerContentClip(path: string): Promise<void> {
    // Register the content to the clip repo, as well as the relevant institution- and user repo
  }
}
