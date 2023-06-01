import {
  Controller,
  Get,
  Param,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { UploadService, StreamService } from './services';
import { MulterOptions } from '@nestjs/platform-express/multer/interfaces/multer-options.interface';
import { ClipValidator, ImageValidator } from './validators';

enum File {
  Institution = 'institution',
  Image = 'image',
  Clip = 'clip',
}

enum Destination {
  Institution = 'content/institution',
  Image = 'content/image',
  Clip = 'content/clip',
}

const getImageOptions = (dest: Destination): MulterOptions => ({
  dest,
  limits: {
    fileSize: 2097152, // 2mb
    files: 1,
  },
  fileFilter: (_req, file, callback) => {
    const valid = ['image/png', 'image/jpeg', 'image/gif'].includes(
      file.mimetype,
    );
    callback(null, valid);
  },
});

const clipOptions: MulterOptions = {
  dest: Destination.Clip,
  limits: {
    fileSize: 5242880, // 5mb
    files: 1,
  },
};

@Controller('files')
export class FilesController {
  constructor(
    private readonly uploadService: UploadService,
    private readonly streamService: StreamService,
  ) {}

  @Get(`${File.Institution}/:id`)
  getInstitutionImage(@Param('id') id: string) {
    console.log(id);
    //TODO:
  }

  @Get(`${File.Image}/:id`)
  getContentImage(@Param('id') id: string) {
    console.log(id);
    //TODO:
  }

  @Get(`${File.Clip}/:id`)
  getContentClip(@Param('id') id: string) {
    console.log(id);
    //TODO:
  }

  @Post(`${File.Institution}`)
  @UseInterceptors(
    FileInterceptor('image', getImageOptions(Destination.Institution)),
  )
  uploadInstitutionImage(
    //@Body() body:
    @UploadedFile(ImageValidator)
    file: Express.Multer.File,
  ) {
    console.log(file);
    return 1;
  }

  @Post(`${File.Image}`)
  @UseInterceptors(FileInterceptor('image', getImageOptions(Destination.Image)))
  uploadContentImage(
    @UploadedFile(ImageValidator)
    file: Express.Multer.File,
  ) {
    console.log(file);
  }

  @Post(`${File.Clip}`)
  @UseInterceptors(FileInterceptor('clip', clipOptions))
  uploadContentClip(
    @UploadedFile(ClipValidator)
    file: Express.Multer.File,
  ) {
    console.log(file);
  }
}
