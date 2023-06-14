import { HttpStatus, ParseFilePipeBuilder } from '@nestjs/common';

export const ClipValidator = new ParseFilePipeBuilder()
  .addFileTypeValidator({
    fileType: '.(ogg|webm)', //TODO: Add filetypes when possible
  })
  .addMaxSizeValidator({
    maxSize: 5242880,
  })
  .build({
    errorHttpStatusCode: HttpStatus.UNSUPPORTED_MEDIA_TYPE,
  });
