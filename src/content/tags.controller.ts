import { Body, Controller, Delete, Get, Param, Post } from '@nestjs/common';
import { TagsService } from './services';
import { CreateTagDto, CreateTagsDto } from './dto';

@Controller('tags')
export class TagsController {
  constructor(private readonly tagService: TagsService) {}

  @Get()
  async getTags() {
    return this.tagService.getTags();
  }

  @Get('/:id')
  async getTag(@Param('id') id: string) {
    return this.tagService.findTag(parseInt(id, 10));
  }
  // TODO: Add administration guard
  @Post()
  async createTag(@Body() body: CreateTagDto) {
    return this.tagService.createTag(body);
  }

  @Post('many')
  async createTags(@Body() body: CreateTagsDto) {
    return this.tagService.createTags(body);
  }

  // Do not uncomment
  @Delete('all')
  deleteAllContent() {
    return this.tagService.clear();
  }
}
