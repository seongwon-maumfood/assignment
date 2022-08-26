import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Response } from '../interface';
import { CreateCommentDto } from './dto/create-comment.dto';
import { UpdateCommentDto } from './dto/update-comment.dto';

@Injectable()
export class CommentService {
  constructor(private prisma: PrismaService) {}

  async create(
    authorId: string,
    id: number,
    createCommentDto: CreateCommentDto,
  ): Promise<Response> {
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
  }

  findAll() {
    return `This action returns all comment`;
  }

  findOne(id: number) {
    return `This action returns a #${id} comment`;
  }

  update(id: number, updateCommentDto: UpdateCommentDto) {
    return `This action updates a #${id} comment`;
  }

  remove(id: number) {
    return `This action removes a #${id} comment`;
  }
}
