import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Response } from '../interface';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';

@Injectable()
export class BoardService {
  constructor(private prisma: PrismaService) {}

  async createPost(
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

          await this.prisma.postsOnTags.create({
            data: { postId: post.id, tagId: tag.id },
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

  async updatePost(
    authorId: string,
    id: number,
    updatePostDto: UpdatePostDto,
  ): Promise<Response> {
    const post = await this.prisma.post.findUnique({ where: { id: id } });

    // 작성자 체크
    if (authorId !== post.authorId) {
      return {
        success: false,
        data: null,
        code: '401',
        message: '작성자만 수정할 수 있습니다.',
      };
    }

    const updatedPost = await this.prisma.post.update({
      where: { id: id },
      data: {
        title: updatePostDto.title,
        content: updatePostDto.content,
      },
    });

    // 해당 포스트의 기존 태그들 삭제
    await this.prisma.postsOnTags.deleteMany({
      where: { postId: post.id },
    });

    if (updatePostDto.tags.length) {
      for (let x of updatePostDto.tags) {
        const tag = await this.prisma.tag.upsert({
          where: { name: x },
          update: {},
          create: { name: x },
        });
        await this.prisma.postsOnTags.create({
          data: { postId: post.id, tagId: tag.id },
        });
      }
    }

    return {
      success:true,
      data: updatedPost,
      code: '200',
      message:  '게시글 수정 완료'
    }
  }

  remove(id: number) {
    return `This action removes a #${id} board`;
  }
}
