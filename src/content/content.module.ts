import { Module } from '@nestjs/common';
import { UploadService, StreamService, TagsService } from './services';
import { FilesController } from './files.controller';
import { TagsController } from './tags.controller';
import { MulterModule } from '@nestjs/platform-express';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ContentClip, ContentImage, Tag } from './entities';
import { User } from '../users/entities';
import { UsersModule } from '../users';
import { Guild, University } from '../institutions/entities';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      ContentImage,
      ContentClip,
      User,
      Guild,
      University,
      Tag,
    ]),
    MulterModule.register({
      dest: './content',
    }),
    UsersModule,
  ],
  providers: [UploadService, StreamService, TagsService],
  controllers: [FilesController, TagsController],
})
export class ContentModule {}
