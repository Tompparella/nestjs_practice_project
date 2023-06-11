import {
  Controller,
  Get,
  Param,
  Body,
  Post,
  UploadedFile,
  UseInterceptors,
  Res,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { UploadService, StreamService } from './services';
import { MulterOptions } from '@nestjs/platform-express/multer/interfaces/multer-options.interface';
import { ClipValidator, ImageValidator } from './pipes';
import { ContentClipDto, ContentImageDto, InstitutionImageDto } from './dto';
import { Response } from 'express';

enum File {
  Institution = 'institution',
  Profile = 'profile',
  Image = 'image',
  Clip = 'clip',
}

enum Destination {
  Institution = 'content/institution',
  Profile = 'content/profile',
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

  @Get(`${File.Institution}/:image`)
  getInstitutionImage(
    @Res() response: Response,
    @Param('image') image: string,
  ) {
    return this.streamService.getInstitutionImage(image, response);
  }

  @Get(`${File.Image}/:image`)
  getContentImage(@Res() response: Response, @Param('image') image: string) {
    return this.streamService.getContentImage(image, response);
  }

  @Get(`${File.Clip}/:clip`)
  getContentClip(@Res() response: Response, @Param('clip') clip: string) {
    return this.streamService.getContentClip(clip, response);
  }

  @Post(`${File.Institution}`)
  @UseInterceptors(
    FileInterceptor('image', getImageOptions(Destination.Institution)),
  )
  uploadInstitutionImage(
    @UploadedFile(ImageValidator)
    file: Express.Multer.File,
    @Body() body: InstitutionImageDto,
  ) {
    switch (body.type) {
      case 'guild':
        return this.uploadService.registerGuildImage(file.filename, body.id);
      case 'university':
        return this.uploadService.registerUniversityImage(
          file.filename,
          body.id,
        );
      default:
    }
  }

  @Post(`${File.Image}`)
  @UseInterceptors(FileInterceptor('image', getImageOptions(Destination.Image)))
  uploadContentImage(
    @UploadedFile(ImageValidator)
    file: Express.Multer.File,
    @Body() body: ContentImageDto,
  ) {
    return this.uploadService.registerContentImage(file.filename, body);
  }

  @Post(`${File.Clip}`)
  @UseInterceptors(FileInterceptor('clip', clipOptions))
  uploadContentClip(
    @UploadedFile(ClipValidator)
    file: Express.Multer.File,
    @Body() body: ContentClipDto,
  ) {
    return this.uploadService.registerContentClip(file.filename, body);
  }

  @Post(`${File.Profile}/:id`)
  @UseInterceptors(
    FileInterceptor('image', getImageOptions(Destination.Profile)),
  )
  uploadProfileImage(
    @UploadedFile(ImageValidator)
    file: Express.Multer.File,
    @Param('id') id: string,
  ) {
    return this.uploadService.registerProfileImage(
      file.filename,
      parseInt(id, 10),
    );
  }
}
