import {
  Controller,
  Get,
  Param,
  Body,
  Post,
  UploadedFile,
  UseInterceptors,
  Header,
  BadRequestException,
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
  ContentDto,
  InstitutionImageDto,
  TagImageDto,
  UploadContentResponseDto,
} from './dto';
import { memoryStorage } from 'multer';
import { CurrentUser } from 'src/users/decorators';
import { User } from 'src/users';
import { Serialize } from 'src/interceptors';

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

  @Get(`${File.Tag}/:image`)
  @Header('Content-Type', 'image/webp')
  getTagImage(@Param('image') image: string) {
    return this.streamService.getTagImage(image);
  }

  @Get(`${File.Image}/:image`)
  @Header('Content-Type', 'image/webp')
  getContentImage(@Param('image') image: string) {
    return this.streamService.getContentImage(image);
  }

  @Get(`${File.Clip}/:clip`)
  @Header('Content-Type', 'video/ogg')
  getContentClip(@Param('clip') clip: string) {
    return this.streamService.getContentClip(clip);
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
  @Serialize(UploadContentResponseDto)
  @UseInterceptors(FileInterceptor('image', getImageOptions(10)))
  uploadContentImage(
    @CurrentUser()
    user: User,
    @UploadedFile(ImageValidator, ContentSharpPipe)
    file: string,
    @Body() body: ContentDto,
  ) {
    if (!user) {
      // TODO: Error handling in case not logged in
      throw new BadRequestException('Not logged in');
    }
    return this.uploadService.registerContent(file, body, user, 'image');
  }

  // TODO: Differentiate uploading clip from image
  @Post(`${File.Clip}`)
  @UseInterceptors(FileInterceptor('clip', clipOptions))
  uploadContentClip(
    @CurrentUser()
    user: User,
    @UploadedFile(ClipValidator, ContentClipSharpPipe)
    file: string,
    @Body() body: ContentDto,
  ) {
    if (!user) {
      // TODO: Error handling in case not logged in
      return;
    }
    return this.uploadService.registerContent(file, body, user, 'clip');
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
