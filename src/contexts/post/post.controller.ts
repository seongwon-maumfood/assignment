import {
  Controller,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Req,
  Get,
  UseInterceptors,
} from '@nestjs/common';
import { Request } from 'express';
import { PostService } from './post.service';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import {
  createPostInterceptor,
  getPostInterceptor,
  updateOrDeletePostInterceptor,
} from './post.interceptor';

@Controller('post')
export class PostController {
  constructor(private readonly postService: PostService) {}

  @Post('/create')
  @UseInterceptors(createPostInterceptor)
  createPost(@Req() req: Request, @Body() createBoardDto: CreatePostDto) {
    return this.postService.createPost(req['user'], createBoardDto);
  }

  @Get()
  @UseInterceptors(getPostInterceptor)
  getAllPosts() {
    return this.postService.getAllPosts();
  }

  @Get(':id')
  @UseInterceptors(getPostInterceptor)
  async getPost(@Param('id') id: string) {
    return this.postService.getPost(+id);
  }

  @Patch(':id')
  @UseInterceptors(updateOrDeletePostInterceptor)
  updatePost(
    @Req() req: Request,
    @Param('id') id: string,
    @Body() updatePostDto: UpdatePostDto,
  ) {
    return this.postService.updatePost(req['user'], +id, updatePostDto);
  }

  @Delete(':id')
  @UseInterceptors(updateOrDeletePostInterceptor)
  deletePost(@Req() req: Request, @Param('id') id: string) {
    return this.postService.deletePost(req['user'], +id);
  }
}
