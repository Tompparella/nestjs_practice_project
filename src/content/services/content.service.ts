import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Content } from '../entities';

@Injectable()
export class ContentService {
  constructor(
    @InjectRepository(Content) private contentRepo: Repository<Content>,
  ) {}

  async getContentFromUniversity(
    userId = -1,
    universityId: number,
    index: number,
  ) {
    return this.contentRepo
      .createQueryBuilder('content')
      .select([
        'content',
        'guild',
        'likes',
        'dislikes',
        'university',
        'tags',
        'creator.id',
        'creator.username',
      ])
      .leftJoin('content.guild', 'guild')
      .leftJoin('guild.university', 'university')
      .leftJoin('content.creator', 'creator')
      .leftJoin('content.likes', 'likes', 'likes.id != :id', { userId })
      .leftJoin('content.dislikes', 'dislikes', 'dislikes.id != :id', {
        userId,
      })
      .leftJoin('content.tags', 'tags')
      .where('university.id = :universityId', { universityId })
      .orderBy('content.id', 'DESC')
      .take(25)
      .getMany();
  }

  async getContentFromGuild(userId = -1, guildId: number, index: number) {
    return this.contentRepo
      .createQueryBuilder('content')
      .select([
        'content',
        'guild',
        'likes',
        'dislikes',
        'university',
        'tags',
        'creator.id',
        'creator.username',
      ])
      .innerJoin('content.guild', 'guild', 'guild.id = :guildId', { guildId })
      .leftJoin('content.creator', 'creator')
      .leftJoin('content.likes', 'likes', 'likes.id != :userId', { userId })
      .leftJoin('content.dislikes', 'dislikes', 'dislikes.id != :userId', {
        userId,
      })
      .leftJoin('guild.university', 'university')
      .leftJoin('content.tags', 'tags')
      .orderBy('content.id', 'DESC')
      .take(25)
      .getMany();
  }

  async getCommonContent(userId = -1, index: number) {
    return this.contentRepo
      .createQueryBuilder('content')
      .select([
        'content',
        'guild',
        'likes',
        'dislikes',
        'university',
        'tags',
        'creator.id',
        'creator.username',
      ])
      .leftJoin('content.creator', 'creator')
      .leftJoin('content.likes', 'likes', 'likes.id != :id', { userId }) // TODO: Filtering by likes is broken. Fix
      .leftJoin('content.dislikes', 'dislikes', 'dislikes.id != :id', {
        userId,
      })
      .leftJoin('content.guild', 'guild')
      .leftJoin('guild.university', 'university')
      .leftJoin('content.tags', 'tags')
      .orderBy('content.id', 'DESC')
      .take(25)
      .getMany();
  }
}
