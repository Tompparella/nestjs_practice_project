import { Module } from '@nestjs/common';
import { UploadService, StreamService, TagsService } from './services';
import { FilesController } from './files.controller';
import { TagsController } from './tags.controller';
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
  providers: [UploadService, StreamService, TagsService],
  controllers: [FilesController, TagsController],
})
export class ContentModule {}
