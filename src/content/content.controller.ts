import {
  BadRequestException,
  Body,
  Controller,
  Get,
  Patch,
  Query,
} from '@nestjs/common';
import { ContentService } from './services';
import { GetContentDto, RateContentDto } from './dto';
import { CurrentUser } from 'src/users/decorators';
import { User } from 'src/users';

enum Content {
  Rate = 'rate',
}

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
}
