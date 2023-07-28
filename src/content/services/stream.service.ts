import { Injectable, NotFoundException, StreamableFile } from '@nestjs/common';
import { createReadStream, existsSync } from 'fs';
import { join } from 'path';
import { FilePath } from '../pipes';

@Injectable()
export class StreamService {
  async getInstitutionImage(image: string): Promise<StreamableFile> {
    const path = join(process.cwd(), `${FilePath.Institution}/${image}`);
    if (existsSync(path)) {
      const stream = createReadStream(path);
      //response.set({ 'Content-Type': 'image/jpeg' });
      return new StreamableFile(stream);
    } else {
      throw new NotFoundException(
        `Institution image with filename ${image} not found`,
      );
    }
  }
  async getTagImage(image: string): Promise<StreamableFile> {
    const path = join(process.cwd(), `${FilePath.Tag}/${image}`);
    if (existsSync(path)) {
      const stream = createReadStream(path);
      //response.set({ 'Content-Type': 'image/jpeg' });
      return new StreamableFile(stream);
    } else {
      throw new NotFoundException(`Tag image with filename ${image} not found`);
    }
  }
  getContentImage(image: string): StreamableFile {
    const path = join(process.cwd(), `${FilePath.Image}/${image}`);
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
  getContentClip(clip: string): StreamableFile {
    const path = join(process.cwd(), `${FilePath.Clip}/${clip}`);
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
