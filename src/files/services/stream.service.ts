import { Injectable, NotFoundException, StreamableFile } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ContentClip, ContentImage } from '../entities';
import { createReadStream, constants, existsSync } from 'fs';
import { join } from 'path';
import { Response } from 'express';
import { access } from 'fs/promises';

@Injectable()
export class StreamService {
  constructor(
    @InjectRepository(ContentImage)
    private imageRepo: Repository<ContentImage>,
    @InjectRepository(ContentClip)
    private clipRepo: Repository<ContentClip>,
  ) {}

  async getInstitutionImage(
    image: string,
    response: Response,
  ): Promise<StreamableFile> {
    const path = join(process.cwd(), `content/institution/${image}`);
    if (existsSync(path)) {
      const stream = createReadStream(path);
      //stream.on('end', () => file.close());
      //response.set({ 'Content-Type': 'image/jpeg' });
      return new StreamableFile(stream);
    } else {
      throw new NotFoundException(
        `Institution image with filename ${image} not found`,
      );
    }
  }
  getContentImage(image: string, response: Response): StreamableFile {
    const path = join(process.cwd(), `content/image/${image}`);
    if (existsSync(path)) {
      const file = createReadStream(path);
      //file.on('error', () => file.close());
      //response.set({ 'Content-Type': 'image/jpeg' });
      return new StreamableFile(file);
    } else {
      throw new NotFoundException(
        `Content image with filename ${image} not found`,
      );
    }
  }
  getContentClip(clip: string, response: Response): StreamableFile {
    const path = join(process.cwd(), `content/clip/${clip}`);
    if (existsSync(path)) {
      const file = createReadStream(path);
      //file.on('error', () => file.close());
      //response.set({ 'Content-Type': 'video/ogg' });
      return new StreamableFile(file);
    } else {
      throw new NotFoundException(
        `Content clip with filename ${clip} not found`,
      );
    }
  }
}
