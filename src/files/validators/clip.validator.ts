import {
  FileTypeValidator,
  HttpStatus,
  MaxFileSizeValidator,
  ParseFilePipe,
} from '@nestjs/common';

export const ClipValidator = new ParseFilePipe({
  validators: [
    new FileTypeValidator({
      fileType: /.(ogg|webm)$/, //TODO: Add filetypes when possible
    }),
    new MaxFileSizeValidator({
      maxSize: 5242880,
    }),
  ],
  errorHttpStatusCode: HttpStatus.UNSUPPORTED_MEDIA_TYPE,
});
