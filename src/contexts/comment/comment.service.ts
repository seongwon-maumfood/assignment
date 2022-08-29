import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateCommentDto } from './dto/create-comment.dto';
import { UpdateCommentDto } from './dto/update-comment.dto';
import { InvalidUserException, NoCommentException } from './comment.exception';

@Injectable()
export class CommentService {
  constructor(private prisma: PrismaService) {}

  async createComment(
    authorId: string,
    target: string,
    id: number,
    createCommentDto: CreateCommentDto,
  ) {
    let comment = {};

    if (target === 'post') {
      comment = await this.prisma.comment.create({
        data: {
          authorId,
          content: createCommentDto.content,
          postId: id,
        },
      });
    } else if (target === 'comment') {
      comment = await this.prisma.comment.create({
        data: {
          authorId,
          content: createCommentDto.content,
          commentId: id,
        },
      });
    }

    return comment;
  }

  async updateComment(
    authorId: string,
    id: number,
    updateCommentDto: UpdateCommentDto,
  ) {
    if ((await this.authorCheck(authorId, id)) === false)
      throw new InvalidUserException();

    const comment = await this.prisma.comment.update({
      where: { id },
      data: { content: updateCommentDto.content },
    });

    if (!comment) throw new NoCommentException();

    return comment;
  }

  async deleteComment(authorId: string, id: number) {
    if ((await this.authorCheck(authorId, id)) === false)
      throw new InvalidUserException();

    const comment = await this.prisma.comment.delete({ where: { id } });
    if (!comment) throw new NoCommentException();
    return comment;
  }

  async authorCheck(authorId: string, commentId: number): Promise<boolean> {
    const comment = await this.prisma.comment.findUnique({
      where: { id: commentId },
    });
    return comment.authorId === authorId ? true : false;
  }
}
