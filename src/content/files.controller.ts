import {
  Controller,
  Get,
  Param,
  Body,
  Post,
  UploadedFile,
  UseInterceptors,
  Res,
  Header,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { UploadService, StreamService } from './services';
import { MulterOptions } from '@nestjs/platform-express/multer/interfaces/multer-options.interface';
import {
  ClipValidator,
  ContentClipSharpPipe,
  ContentSharpPipe,
  ImageValidator,
  InstitutionSharpPipe,
  ProfileSharpPipe,
  TagSharpPipe,
} from './pipes';
import {
  ContentClipDto,
  ContentImageDto,
  InstitutionImageDto,
  TagImageDto,
} from './dto';
import { Response } from 'express';
import { memoryStorage } from 'multer';
import { CurrentUser } from 'src/users/decorators';
import { User } from 'src/users';

enum File {
  Institution = 'institution',
  Profile = 'profile',
  Image = 'image',
  Clip = 'clip',
  Tag = 'tag',
}

const getImageOptions = (fileSizeMb: number): MulterOptions => ({
  storage: memoryStorage(),
  limits: {
    fileSize: 1024 * 1024 * fileSizeMb,
    files: 1,
  },
  fileFilter: (_req, file, callback) => {
    const valid = [
      'image/png',
      'image/jpeg',
      'image/gif',
      'image/webp',
    ].includes(file.mimetype);
    callback(null, valid);
  },
});

const clipOptions: MulterOptions = {
  storage: memoryStorage(),
  limits: {
    fileSize: 1024 * 1024 * 20,
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
  @Header('Content-Type', 'image/webp')
  getInstitutionImage(@Param('image') image: string) {
    return this.streamService.getInstitutionImage(image);
  }

  @Get(`${File.Image}/:image`)
  @Header('Content-Type', 'image/webp')
  getContentImage(@Res() response: Response, @Param('image') image: string) {
    return this.streamService.getContentImage(image, response);
  }

  @Get(`${File.Clip}/:clip`)
  @Header('Content-Type', 'video/ogg')
  getContentClip(@Res() response: Response, @Param('clip') clip: string) {
    return this.streamService.getContentClip(clip, response);
  }

  @Post(`${File.Institution}`)
  @UseInterceptors(FileInterceptor('image', getImageOptions(5)))
  uploadInstitutionImage(
    @UploadedFile(ImageValidator, InstitutionSharpPipe)
    file: string,
    @Body() body: InstitutionImageDto,
  ) {
    switch (body.type) {
      case 'guild':
        return this.uploadService.registerGuildImage(file, body.id);
      case 'university':
        return this.uploadService.registerUniversityImage(file, body.id);
      default:
    }
  }

  @Post(`${File.Tag}`)
  @UseInterceptors(FileInterceptor('image', getImageOptions(5)))
  uploadTagImage(
    @UploadedFile(ImageValidator, TagSharpPipe)
    file: string,
    @Body() body: TagImageDto,
  ) {
    return this.uploadService.registerTagImage(file, body.id);
  }

  @Post(`${File.Image}`)
  @UseInterceptors(FileInterceptor('image', getImageOptions(10)))
  uploadContentImage(
    @CurrentUser()
    user: User,
    @UploadedFile(ImageValidator, ContentSharpPipe)
    file: string,
    @Body() body: ContentImageDto,
  ) {
    if (!user) {
      // TODO: Error handling in case not logged in
      return;
    }
    return this.uploadService.registerContentImage(file, body, user);
  }

  // TODO: Differentiate uploading clip from image
  @Post(`${File.Clip}`)
  @UseInterceptors(FileInterceptor('clip', clipOptions))
  uploadContentClip(
    @CurrentUser()
    user: User,
    @UploadedFile(ClipValidator, ContentClipSharpPipe)
    file: string,
    @Body() body: ContentClipDto,
  ) {
    if (!user) {
      // TODO: Error handling in case not logged in
      return;
    }
    return this.uploadService.registerContentClip(file, body, user);
  }

  @Post(`${File.Profile}/:id`)
  @UseInterceptors(FileInterceptor('image', getImageOptions(5)))
  uploadProfileImage(
    @CurrentUser()
    user: User,
    @UploadedFile(ImageValidator, ProfileSharpPipe)
    file: string,
    @Param('id') id: string,
  ) {
    if (!user) {
      // TODO: Error handling in case not logged in
      return;
    }
    return this.uploadService.registerProfileImage(
      file,
      parseInt(id, 10),
      user,
    );
  }
}
