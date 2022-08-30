import {
  Controller,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Req,
  Get,
} from '@nestjs/common';
import { Request } from 'express';
import { PostService } from './post.service';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';

@Controller('post')
export class PostController {
  constructor(private readonly postService: PostService) {}

  @Post('/create')
  createPost(@Req() req: Request, @Body() createBoardDto: CreatePostDto) {
    return this.postService.createPost(req['user'], createBoardDto);
  }

  @Get()
  getAllPosts() {
    return this.postService.getAllPosts();
  }

  @Get(':id') async getPost(@Param('id') id: string) {
    return this.postService.getPost(+id);
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
    return this.postService.deletePost(req['user'], +id);
  }
}
