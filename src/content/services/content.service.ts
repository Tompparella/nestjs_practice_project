import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, FindManyOptions, Not } from 'typeorm';
import { Content } from '../entities';

const defaultOptions: FindManyOptions<Content> = {
  order: { id: 'DESC' },
  relations: {
    likes: true,
    dislikes: true,
    guild: { university: true },
    tags: true,
    creator: true,
  },
  take: 25,
};

@Injectable()
export class ContentService {
  constructor(
    @InjectRepository(Content) private contentRepo: Repository<Content>,
  ) {}

  async getContentFromUniversity(userId = -1, id: number, index: number) {
    this.contentRepo.find({
      ...defaultOptions,
      where: {
        likes: { id: Not(userId) },
        dislikes: { id: Not(userId) },
        guild: {
          university: {
            id,
          },
        },
      },
    });
  }

  async getContentFromGuild(userId = -1, id: number, index: number) {
    console.log(userId);
    return (
      this.contentRepo
        .createQueryBuilder('content')
        .leftJoin('content.creator', 'creator')
        .leftJoin('content.likes', 'likes')
        .leftJoin('content.dislikes', 'dislikes')
        .leftJoin('content.guild', 'guild')
        .leftJoin('guild.university', 'guild.university')
        .leftJoin('content.tags', 'tags')
        .where('guild.id = :id', { id })
        /* .andWhere(`content.likes != :userId`, { userId })
      .andWhere('content.dislikes != :userId', { userId }) */
        .select([
          'content',
          'guild',
          'likes',
          'dislikes',
          'guild.university',
          'tags',
          'creator.id',
          'creator.username',
        ])
        .getMany()
    );
    /* const lol = await this.contentRepo.find({
      ...defaultOptions,
      where: {
        likes: { id: Not(ArrayContainedBy(userId)) },
        dislikes: { id: Not(ArrayContainedBy(userId)) },
        guild: {
          id,
        },
      },
    }); */
  }

  async getCommonContent(userId = -1, index: number) {
    this.contentRepo.find({
      ...defaultOptions,
      where: {
        likes: { id: Not(userId) },
        dislikes: { id: Not(userId) },
      },
    });
  }
}
