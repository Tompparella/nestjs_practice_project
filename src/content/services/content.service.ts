import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Brackets } from 'typeorm';
import { Content } from '../entities';
import { User } from 'src/users';

@Injectable()
export class ContentService {
  constructor(
    @InjectRepository(Content) private contentRepo: Repository<Content>,
  ) {}

  /**
   *
   * @param userId
   * @param universityId
   * @param index
   * @returns Content[]
   *
   * Common for all queries is that we want to filter the data that a user can fetch from the database.
   * We also want to return only the content that the user is yet to rate. There will be a separate query
   * for fetching already rated content.
   */

  async getRandomContent(index: number) {
    const result = await this.contentRepo
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
        'creator.imageUrl',
      ]) // TODO: Timestamp!!
      .leftJoin('content.guild', 'guild')
      .leftJoin('guild.university', 'university')
      .leftJoin('content.creator', 'creator')
      .leftJoin('content.likes', 'likes')
      .leftJoin('content.dislikes', 'dislikes')
      .leftJoin('content.tags', 'tags')
      .orderBy('RANDOM()')
      .offset(index)
      .take(10)
      .getMany();
    return result;
  }

  async getContentFromUniversity(
    userId = -1,
    universityId: number,
    index: number,
  ) {
    const result = await this.contentRepo
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
        'creator.imageUrl',
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
      .andWhere(
        new Brackets((qb) => {
          qb.where('dislikes.id IS NULL').orWhere(
            ':userId NOT IN(dislikes.id)',
            { userId },
          );
        }),
      )
      .andWhere(
        new Brackets((qb) => {
          qb.where('likes.id IS NULL').orWhere(':userId NOT IN(likes.id)', {
            userId,
          });
        }),
      )
      .orderBy('content.id', 'DESC')
      .offset(index)
      .take(10)
      .getMany();
    if (result.length > 0) {
      return result;
    } else {
      return this.getRandomContent(index);
    }
  }

  async getContentFromGuild(userId = -1, guildId: number, index: number) {
    const result = await this.contentRepo
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
        'creator.imageUrl',
      ])
      .innerJoin('content.guild', 'guild', 'guild.id = :guildId', { guildId })
      .leftJoin('content.creator', 'creator')
      .leftJoin('content.likes', 'likes')
      .leftJoin('content.dislikes', 'dislikes')
      .leftJoin('guild.university', 'university')
      .leftJoin('content.tags', 'tags')
      .where(
        new Brackets((qb) => {
          qb.where('dislikes.id IS NULL').orWhere(
            ':userId NOT IN(dislikes.id)',
            { userId },
          );
        }),
      )
      .andWhere(
        new Brackets((qb) => {
          qb.where('likes.id IS NULL').orWhere(':userId NOT IN(likes.id)', {
            userId,
          });
        }),
      )
      .orderBy('content.id', 'DESC')
      .offset(index)
      .take(10)
      .getMany();
    if (result.length > 0) {
      return result;
    } else {
      return this.getRandomContent(index);
    }
  }

  async getCommonContent(userId = -1, index: number) {
    const result = await this.contentRepo
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
        'creator.imageUrl',
      ])
      .leftJoin('content.creator', 'creator')
      .leftJoin('content.likes', 'likes')
      .leftJoin('content.dislikes', 'dislikes')
      .leftJoin('content.guild', 'guild')
      .leftJoin('guild.university', 'university')
      .leftJoin('content.tags', 'tags')
      .where(
        new Brackets((qb) => {
          qb.where('dislikes.id IS NULL').orWhere(
            ':userId NOT IN(dislikes.id)',
            { userId },
          );
        }),
      )
      .andWhere(
        new Brackets((qb) => {
          qb.where('likes.id IS NULL').orWhere(':userId NOT IN(likes.id)', {
            userId,
          });
        }),
      )
      .orderBy('content.id', 'DESC')
      .offset(index)
      .take(10)
      .getMany();
    if (result.length > 0) {
      return result;
    } else {
      return this.getRandomContent(index);
    }
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
    // TODO: Tag handling
    try {
      const content = await this.findContentToBeRated(contentId, user);
      content.likes.push(user);
      const result = await this.contentRepo.save(content);
      return Boolean(result);
    } catch (e) {
      throw e;
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
      throw e;
    }
  }

  async deleteContent(id: number, user: User) {
    try {
      const content = await this.contentRepo.findOne({ where: { id } });
      console.log(content);
      if (content && (user.admin || content.creator.id === user.id)) {
        this.contentRepo.remove(content);
      } else {
        return new ForbiddenException(
          "You don't have the permission to delete that",
        );
      }
    } catch (e) {
      throw new BadRequestException(`Failed to delete content with id ${id}`);
    }
  }

  // Do not use outside of testing
  clear() {
    try {
      return this.contentRepo.clear();
    } catch (e) {
      throw new InternalServerErrorException('Operation failed');
    }
  }
}
