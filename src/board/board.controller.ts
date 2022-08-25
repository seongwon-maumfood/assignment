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
import { UpdateBoardDto } from './dto/update-post.dto';

@Controller('board')
export class BoardController {
  constructor(private readonly boardService: BoardService) {}

  @Post()
  async create(@Req() req: Request, @Body() createBoardDto:CreatePostDto) {
    return this.boardService.create(req['user'],createBoardDto);
  }

  @Get()
  findAll(@Req() req: Request, @Body() title:string) {
    console.log(11111111, req.body);
    console.log(2222222, req['user']);
    return this.boardService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.boardService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateBoardDto: UpdateBoardDto) {
    return this.boardService.update(+id, updateBoardDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.boardService.remove(+id);
  }
}
