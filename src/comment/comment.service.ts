import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Response } from '../interface';
import { CreateCommentDto } from './dto/create-comment.dto';
import { UpdateCommentDto } from './dto/update-comment.dto';

@Injectable()
export class CommentService {
  constructor(private prisma: PrismaService) {}

  async createComment(
    authorId: string,
    id: number,
    createCommentDto: CreateCommentDto,
  ): Promise<Response> {
    try {
      let comment = {};

      if (createCommentDto.target === 'post') {
        comment = await this.prisma.comment.create({
          data: {
            authorId,
            content: createCommentDto.content,
            postId: id,
          },
        });
      } else if (createCommentDto.target === 'comment') {
        comment = await this.prisma.comment.create({
          data: {
            authorId,
            content: createCommentDto.content,
            commentId: id,
          },
        });
      }

      return {
        success: true,
        data: comment,
        code: '201',
        message: '댓글 작성 완료',
      };
    } catch (e) {
      console.log(e);
      return {
        success: false,
        data: null,
        code: '500',
        message: 'Internal server error',
      };
    }
  }

  async updateComment(
    authorId: string,
    id: number,
    updateCommentDto: UpdateCommentDto,
  ): Promise<Response> {
    try {
      if ((await this.authorCheck(authorId, id)) === false) {
        return {
          success: false,
          data: null,
          code: '401',
          message: '작성자만 수정할 수 있습니다.',
        };
      }

      const comment = await this.prisma.comment.update({
        where: { id },
        data: { content: updateCommentDto.content },
      });

      return {
        success: true,
        data: comment,
        code: '200',
        message: '댓글 수정 완료',
      };
    } catch (e) {
      console.log(e);
      return {
        success: false,
        data: null,
        code: '500',
        message: 'Internal server error',
      };
    }
  }

  async deleteComment(authorId: string, id: number): Promise<Response> {
    try {
      if ((await this.authorCheck(authorId, id)) === false) {
        return {
          success: false,
          data: null,
          code: '401',
          message: '작성자만 삭제할 수 있습니다.',
        };
      }

      await this.prisma.comment.delete({ where: { id } });

      return {
        success: true,
        data: null,
        code: '200',
        message: '댓글 삭제 완료',
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

  async authorCheck(authorId: string, commentId: number): Promise<boolean> {
    const comment = await this.prisma.comment.findUnique({
      where: { id: commentId },
    });
    return comment.authorId === authorId ? true : false;
  }
}
