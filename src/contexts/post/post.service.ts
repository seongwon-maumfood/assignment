import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { InvalidUserException, NoPostException } from './post.exception';

@Injectable()
export class PostService {
  constructor(private prisma: PrismaService) {}

  // 게시글 작성
  async createPost(authorId: string, createPostDto: CreatePostDto) {
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

    return post;
  }

  async getAllPosts() {
    const posts = await this.prisma.post.findMany({});
    return posts;
  }

  async getPost(id: number) {
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
    return post;
  }

  // 게시글 수정
  async updatePost(authorId: string, id: number, updatePostDto: UpdatePostDto) {
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

    return updatedPost;
  }

  // 게시글 삭제
  async deletePost(authorId: string, id: number) {
    const post = await this.prisma.post.findUnique({ where: { id } });
    if (!post) throw new NoPostException();

    // 작성자 체크
    if (authorId !== post.authorId) throw new InvalidUserException();

    await this.prisma.post.delete({ where: { id } });
    return post;
  }
}
