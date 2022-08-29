import {
  Controller,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Req,
} from '@nestjs/common';
import { Request } from 'express';
import { CommentService } from './comment.service';
import { CreateCommentDto } from './dto/create-comment.dto';
import { UpdateCommentDto } from './dto/update-comment.dto';

@Controller('comment')
export class CommentController {
  constructor(private readonly commentService: CommentService) {}

  @Post(':target/:id')
  create(
    @Req() req: Request,
    @Param('target') target: string,
    @Param('id') id: string,
    @Body() createCommentDto: CreateCommentDto,
  ) {
    return this.commentService.createComment(
      req['user'],
      target,
      +id,
      createCommentDto,
    );
  }

  @Patch(':id')
  updateComment(
    @Req() req: Request,
    @Param('id') id: string,
    @Body() updateCommentDto: UpdateCommentDto,
  ) {
    return this.commentService.updateComment(
      req['user'],
      +id,
      updateCommentDto,
    );
  }

  @Delete(':id')
  remove(@Req() req: Request, @Param('id') id: string) {
    return this.commentService.deleteComment(req['user'], +id);
  }
}
