import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { Response } from '../../interface';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { InvalidUserException, NoPostException } from './post.exception';

@Injectable()
export class PostService {
  constructor(private prisma: PrismaService) {}

  // 게시글 작성
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
        for (const _tag of createPostDto.tags) {
          const tag = await this.prisma.tag.upsert({
            where: { name: _tag },
            update: {},
            create: { name: _tag },
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

  async getAllPosts(): Promise<Response> {
    const posts = await this.prisma.post.findMany({});
    return {
      success: true,
      data: posts,
      code: '200',
      message: '포스트 목록 조회 완료',
    };
  }

  async getPost(id: number): Promise<Response> {
    const post = await this.prisma.post.findUnique({
      where: { id },
      include: {
        comments: {
          include: {
            comments: true,
          },
        },
      },
    });
    return {
      success: true,
      data: post,
      code: '200',
      message: '포스트 상세 조회 완료',
    };
  }

  // 게시글 수정
  async updatePost(
    authorId: string,
    id: number,
    updatePostDto: UpdatePostDto,
  ): Promise<Response> {
    try {
      const post = await this.prisma.post.findUnique({ where: { id: id } });
      if (!post) throw new NoPostException();

      // 작성자 체크
      if (authorId !== post.authorId) throw new InvalidUserException();
      const updatedPost = await this.prisma.post.update({
        where: { id: id },
        data: {
          title: updatePostDto.title,
          content: updatePostDto.content,
        },
      });

      if (updatePostDto.tags.length) {
        const tags = await this.prisma.postsOnTags.findMany({
          where: { postId: post.id },
        });

        //  기존에 있었지만 없어지는 태그들
        if (tags) {
          for (const tag of tags) {
            const _tag = await this.prisma.tag.findUnique({
              where: { id: tag.tagId },
            });
            if (!updatePostDto.tags.find((e) => e === _tag.name)) {
              await this.prisma.postsOnTags.delete({
                where: { postId_tagId: { postId: post.id, tagId: tag.tagId } },
              });
            }
          }
        }

        // 기존에 없었지만 생기는 태그들
        for (const _tag of updatePostDto.tags) {
          const tag = await this.prisma.tag.upsert({
            where: { name: _tag },
            update: {},
            create: { name: _tag },
          });
          await this.prisma.postsOnTags.upsert({
            where: { postId_tagId: { postId: post.id, tagId: tag.id } },
            update: {},
            create: { postId: post.id, tagId: tag.id },
          });
        }
      } else {
        // 태그 입력값이 없을때
        await this.prisma.postsOnTags.deleteMany({
          where: { postId: post.id },
        });
      }

      return {
        success: true,
        data: updatedPost,
        code: '200',
        message: '게시글 수정 완료',
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

  // 게시글 삭제
  async deletePost(authorId: string, id: number): Promise<Response> {
    try {
      const post = await this.prisma.post.findUnique({ where: { id } });
      if (!post) throw new NoPostException();

      // 작성자 체크
      if (authorId !== post.authorId) throw new InvalidUserException();

      await this.prisma.post.delete({ where: { id } });
      return {
        success: true,
        data: null,
        code: '200',
        message: '게시글 삭제 완료',
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
}
