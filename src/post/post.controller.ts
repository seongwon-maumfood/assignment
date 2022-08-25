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
import { PostService } from './post.service';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';

@Controller('board')
export class PostController {
  constructor(private readonly postService: PostService) {}

  @Post('/post')
  async createPost(@Req() req: Request, @Body() createBoardDto: CreatePostDto) {
    return this.postService.createPost(req['user'], createBoardDto);
  }

  @Patch(':id')
  updatePost(
    @Req() req: Request,
    @Param('id') id: string,
    @Body() updatePostDto: UpdatePostDto,
  ) {
    return this.postService.updatePost(req['user'], +id, updatePostDto);
  }

  @Delete(':id')
  deletePost(@Req() req: Request, @Param('id') id: string) {
    return this.postService.deletePost(req['user'],+id);
  }
}
