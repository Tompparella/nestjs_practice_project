import { Module } from '@nestjs/common';
import { UploadService, StreamService } from './services';
import { FilesController } from './files.controller';
import { MulterModule } from '@nestjs/platform-express';

@Module({
  imports: [
    MulterModule.register({
      dest: './content',
    }),
  ],
  providers: [UploadService, StreamService],
  controllers: [FilesController],
})
export class FilesModule {}
