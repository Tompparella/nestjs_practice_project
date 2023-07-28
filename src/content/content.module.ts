import { Module } from '@nestjs/common';
import {
  UploadService,
  StreamService,
  TagsService,
  ContentService,
} from './services';
import { FilesController } from './files.controller';
import { TagsController } from './tags.controller';
import { ContentController } from './content.controller';
import { MulterModule } from '@nestjs/platform-express';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Tag, Content } from './entities';
import { User } from '../users/entities';
import { Guild, University } from '../institutions/entities';

@Module({
  imports: [
    TypeOrmModule.forFeature([User, Guild, University, Content, Tag]),
    MulterModule.register({
      dest: './content',
    }),
  ],
  providers: [UploadService, StreamService, TagsService, ContentService],
  controllers: [FilesController, TagsController, ContentController],
})
export class ContentModule {}
