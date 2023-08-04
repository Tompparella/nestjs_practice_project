import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Content } from '../entities';

@Injectable()
export class ContentService {
  constructor(
    @InjectRepository(Content) private contentRepo: Repository<Content>,
  ) {}

  async getContentFromUniversity(userId = -1, id: number, index: number) {
    return this.contentRepo
      .createQueryBuilder('content')
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
      .leftJoin('content.creator', 'creator')
      .leftJoin('content.likes', 'likes', 'likes.id != :id', { userId })
      .leftJoin('content.dislikes', 'dislikes', 'dislikes.id != :id', {
        userId,
      })
      .leftJoin('content.guild', 'guild', 'guild.id = :id', { id })
      .leftJoin('guild.university', 'guild.university')
      .leftJoin('content.tags', 'tags')
      .orderBy('content.id', 'DESC')
      .take(25)
      .getMany();
  }

  async getContentFromGuild(userId = -1, id: number, index: number) {
    return this.contentRepo
      .createQueryBuilder('content')
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
      .leftJoin('content.creator', 'creator')
      .leftJoin('content.likes', 'likes', 'likes.id != :id', { userId })
      .leftJoin('content.dislikes', 'dislikes', 'dislikes.id != :id', {
        userId,
      })
      .leftJoin('content.guild', 'guild', 'guild.id = :id', { id })
      .leftJoin('guild.university', 'guild.university')
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
        'guild.university',
        'tags',
        'creator.id',
        'creator.username',
      ])
      .leftJoin('content.creator', 'creator')
      .leftJoin('content.likes', 'likes', 'likes.id != :id', { userId })
      .leftJoin('content.dislikes', 'dislikes', 'dislikes.id != :id', {
        userId,
      })
      .leftJoin('content.guild', 'guild')
      .leftJoin('guild.university', 'guild.university')
      .leftJoin('content.tags', 'tags')
      .orderBy('content.id', 'DESC')
      .take(25)
      .getMany();
  }
}
