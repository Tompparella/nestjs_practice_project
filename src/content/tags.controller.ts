import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { TagsService } from './services';
import { CreateTagDto } from './dto';

@Controller('tags')
export class TagsController {
  constructor(private readonly tagService: TagsService) {}

  @Get('/:id')
  async getTag(@Param('id') id: string) {
    return this.tagService.findTag(parseInt(id, 10));
  }
  // TODO: Add administration guard
  @Post()
  async createTag(@Body() body: CreateTagDto) {
    return this.tagService.createTag(body);
  }
}
