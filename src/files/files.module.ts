import { Module } from '@nestjs/common';
import { UploadService, StreamService } from './services';
import { FilesController } from './files.controller';
import { MulterModule } from '@nestjs/platform-express';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Guild, University } from '../institutions';
import { ContentClip, ContentImage } from './entities';

@Module({
  imports: [
    TypeOrmModule.forFeature([University, Guild, ContentImage, ContentClip]),
    MulterModule.register({
      dest: './content',
    }),
  ],
  providers: [UploadService, StreamService],
  controllers: [FilesController],
})
export class FilesModule {}
