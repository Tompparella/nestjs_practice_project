import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  ForbiddenException,
  Get,
  Patch,
  Query,
} from '@nestjs/common';
import { ContentService } from './services';
import {
  ContentResponseDto,
  DeleteContentDto,
  GetContentDto,
  RateContentDto,
} from './dto';
import { CurrentUser } from 'src/users/decorators';
import { User } from 'src/users';
import { Serialize } from 'src/interceptors';

enum Content {
  Rate = 'rate',
}

@Controller('content')
export class ContentController {
  constructor(private readonly contentService: ContentService) {}

  @Get()
  @Serialize(ContentResponseDto)
  getContent(
    @CurrentUser()
    user: User,
    @Query() query: GetContentDto,
  ) {
    if (user === undefined) {
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

  @Patch()
  modifyContent() {
    // TODO: Option to modify users own content
  }

  @Patch(Content.Rate)
  rateContent(
    @CurrentUser()
    user: User,
    @Body() body: RateContentDto,
  ) {
    if (!user) {
      throw new BadRequestException('You need to login before rating content');
    }
    const { contentId, rating } = body;
    if (rating === 'like') {
      return this.contentService.likeContent(contentId, user);
    } else if (rating === 'dislike') {
      return this.contentService.dislikeContent(contentId, user);
    }
  }

  @Delete()
  deleteContent(
    @CurrentUser()
    user: User,
    @Query() query: DeleteContentDto,
  ) {
    if (!user) {
      throw new ForbiddenException('You need to be logged in to do that');
    }
    return this.contentService.deleteContent(query.id, user);
  }

  // Do not use outside of testing. KEEP COMMENTED OUT
  @Delete('all')
  deleteAllContent() {
    return this.contentService.clear();
  }
}
