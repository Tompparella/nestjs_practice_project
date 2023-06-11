import { Module } from '@nestjs/common';
import { UploadService, StreamService } from './services';
import { FilesController } from './files.controller';
import { MulterModule } from '@nestjs/platform-express';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ContentClip, ContentImage } from './entities';
import { User } from '../users';
import { Guild, University } from '../institutions';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      ContentImage,
      ContentClip,
      User,
      Guild,
      University,
    ]),
    MulterModule.register({
      dest: './content',
    }),
  ],
  providers: [UploadService, StreamService],
  controllers: [FilesController],
})
export class FilesModule {}
