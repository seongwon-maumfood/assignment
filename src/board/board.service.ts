import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Response } from '../interface';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdateBoardDto } from './dto/update-post.dto';

@Injectable()
export class BoardService {
  constructor(private prisma: PrismaService) {}

  async create(
    authorId: string,
    createPostDto: CreatePostDto,
  ): Promise<Response> {
    try {
      const post = await this.prisma.post.create({
        data: {
          title: createPostDto.title,
          content: createPostDto.content,
          authorId,
        },
      });
      if (createPostDto.tags.length) {
        for (let x of createPostDto.tags) {
          const tag = await this.prisma.tag.upsert({
            where: { name: x },
            update: {},
            create: { name: x },
          });

          await this.prisma.postsOnTags.upsert({
            where: { postId_tagId: { postId: post.id, tagId: tag.id } },
            update: {},
            create: { postId: post.id, tagId: tag.id },
          });
        }
      }

      return {
        success: true,
        data: post,
        code: '201',
        message: '게시글 작성 완료.',
      };
    } catch (e) {
      console.log(e);
      return {
        success: false,
        data: null,
        code: '500',
        message: 'Internal server error.',
      };
    }
  }

  findAll() {
    return `This action returns all board`;
  }

  findOne(id: number) {
    return `This action returns a #${id} board`;
  }

  update(id: number, updateBoardDto: UpdateBoardDto) {
    return `This action updates a #${id} board`;
  }

  remove(id: number) {
    return `This action removes a #${id} board`;
  }
}
