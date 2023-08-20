import { Injectable, PipeTransform } from '@nestjs/common';
import { join, parse } from 'path';
import sharp from 'sharp';
import { Path } from './paths';

@Injectable()
export class InstitutionSharpPipe
  implements PipeTransform<Express.Multer.File, Promise<string>>
{
  async transform(image: Express.Multer.File): Promise<string> {
    const originalName = parse(image.originalname).name;
    const filename = Date.now() + '-' + originalName + '.webp';
    await sharp(image.buffer)
      .resize(400)
      .webp({ effort: 3 })
      .toFile(join(Path.Institution, filename));
    return filename;
  }
}
