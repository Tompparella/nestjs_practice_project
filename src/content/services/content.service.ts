import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Content } from '../entities';
import { User } from 'src/users';

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
        'likes.id',
        'dislikes.id',
        'university',
        'tags',
        'creator.id',
        'creator.username',
      ])
      .leftJoin('content.guild', 'guild')
      .leftJoin('guild.university', 'university')
      .leftJoin('content.creator', 'creator')
      .leftJoin('content.likes', 'likes', 'likes.id != :userId', { userId })
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
        'likes.id',
        'dislikes.id',
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
        'likes.id',
        'dislikes.id',
        'university',
        'tags',
        'creator.id',
        'creator.username',
      ])
      .leftJoin('content.creator', 'creator')
      .leftJoin('content.likes', 'likes', 'likes.id != :userId', { userId }) // TODO: Filtering by likes is broken. Fix
      .leftJoin('content.dislikes', 'dislikes', 'dislikes.id != :userId', {
        userId,
      })
      .leftJoin('content.guild', 'guild')
      .leftJoin('guild.university', 'university')
      .leftJoin('content.tags', 'tags')
      .orderBy('content.id', 'DESC')
      .take(25)
      .getMany();
  }

  async findContentToBeRated(contentId: number, user: User) {
    const content = await this.contentRepo
      .createQueryBuilder('content')
      .leftJoin('content.likes', 'likes', 'likes.id = :userId', {
        userId: user.id,
      })
      .leftJoin('content.dislikes', 'dislikes', 'dislikes.id = :userId', {
        userId: user.id,
      })
      .where('content.id = :contentId', { contentId })
      .select(['content', 'likes.id', 'dislikes.id'])
      .getOne();
    if (content) {
      const ratings = content.likes
        .flatMap((rating) => rating.id)
        .concat(content.dislikes.flatMap((rating) => rating.id));
      if (ratings.includes(user.id)) {
        throw new BadRequestException("You've already rated this content!");
      } else {
        return content;
      }
    } else {
      throw new NotFoundException('No content found with given id');
    }
  }

  async likeContent(contentId: number, user: User) {
    try {
      const content = await this.findContentToBeRated(contentId, user);
      content.likes.push(user);
      const result = await this.contentRepo.save(content);
      return Boolean(result);
    } catch (e) {
      console.error(`User ${user.id} failed to rate content ${contentId}`); // TODO: Better logging
      return new InternalServerErrorException(
        "An unexpected error happened while attempting to like content. If the error doesn't disappear with a page reload, please contact administration.",
      );
    }
  }

  async dislikeContent(contentId: number, user: User) {
    // TODO: Tag handling
    try {
      const content = await this.findContentToBeRated(contentId, user);
      content.dislikes.push(user);
      const result = await this.contentRepo.save(content);
      return Boolean(result);
    } catch (e) {
      console.error(`User ${user.id} failed to rate content ${contentId}`); // TODO: Better logging
      return new InternalServerErrorException(
        "An unexpected error happened while attempting to dislike content. If the error doesn't disappear with a page reload, please contact administration.",
      );
    }
  }
}
