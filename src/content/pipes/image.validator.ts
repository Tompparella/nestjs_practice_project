import { HttpStatus, ParseFilePipeBuilder } from '@nestjs/common';

export const ImageValidator = new ParseFilePipeBuilder()
  .addFileTypeValidator({
    fileType: /(jpg|jpeg|png|gif|webp)$/,
  })
  .addMaxSizeValidator({
    maxSize: 5242880,
  })
  .build({
    errorHttpStatusCode: HttpStatus.UNSUPPORTED_MEDIA_TYPE,
  });
