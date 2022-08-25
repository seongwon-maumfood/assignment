import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Req,
  Res,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { BoardService } from './board.service';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';

@Controller('board')
export class BoardController {
  constructor(private readonly boardService: BoardService) {}

  @Post('/post')
  async createPost(@Req() req: Request, @Body() createBoardDto: CreatePostDto) {
    return this.boardService.createPost(req['user'], createBoardDto);
  }

  @Patch(':id')
  updatePost(
    @Req() req: Request,
    @Param('id') id: string,
    @Body() updatePostDto: UpdatePostDto,
  ) {
    return this.boardService.updatePost(req['user'], +id, updatePostDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.boardService.remove(+id);
  }
}
