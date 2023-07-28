import { BadRequestException, Controller, Get, Query } from '@nestjs/common';
import { ContentService } from './services';
import { GetContentDto } from './dto';
import { CurrentUser } from 'src/users/decorators';
import { User } from 'src/users';

@Controller('content')
export class ContentController {
  constructor(private readonly contentService: ContentService) {}

  @Get()
  getContent(
    @CurrentUser()
    { id: userId }: User,
    @Query() query: GetContentDto,
  ) {
    if (!userId) {
      throw new BadRequestException('You need to login before viewing content');
    }
    const { guildId, universityId, index } = query;
    if (guildId !== undefined) {
      return this.contentService.getContentFromGuild(userId, guildId, index);
    } else if (universityId !== undefined) {
      return this.contentService.getContentFromUniversity(
        userId,
        universityId,
        index,
      );
    } else {
      return this.contentService.getCommonContent(userId, index);
    }
  }
}
