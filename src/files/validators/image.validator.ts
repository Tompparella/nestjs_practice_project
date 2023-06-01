import {
  FileTypeValidator,
  HttpStatus,
  MaxFileSizeValidator,
  ParseFilePipe,
} from '@nestjs/common';

export const ImageValidator = new ParseFilePipe({
  validators: [
    new FileTypeValidator({
      fileType: /.(jpg|jpeg|png)$/,
    }),
    new MaxFileSizeValidator({ maxSize: 2097152 }),
  ],
  errorHttpStatusCode: HttpStatus.UNSUPPORTED_MEDIA_TYPE,
});
