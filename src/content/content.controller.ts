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
    user: User,
    @Query() query: GetContentDto,
  ) {
    if (!user?.id) {
      throw new BadRequestException('You need to login before viewing content');
    }
    const { guildId, universityId, index } = query;
    if (guildId !== undefined) {
      return this.contentService.getContentFromGuild(user.id, guildId, index);
    } else if (universityId !== undefined) {
      return this.contentService.getContentFromUniversity(
        user.id,
        universityId,
        index,
      );
    } else {
      return this.contentService.getCommonContent(user.id, index);
    }
  }
}
