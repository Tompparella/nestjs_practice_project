import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ContentClip, ContentImage } from '../entities';

@Injectable()
export class StreamService {
  constructor(
    @InjectRepository(ContentImage)
    private imageRepo: Repository<ContentImage>,
    @InjectRepository(ContentClip)
    private clipRepo: Repository<ContentClip>,
  ) {}
  async getInstitutionImage(): Promise<void> {
    // TODO: Get relevant institution's image
    // TODO: Create a repository for institution images
  }
  async getContentImage(): Promise<void> {
    // TODO: Get the content image from its repo with its id
  }
  async getContentClip(): Promise<void> {
    // TODO: Get the content clip from its repo with its id
  }
}
