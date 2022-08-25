import { Query, Req, Res } from '@nestjs/common';
import {
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Body,
  Post,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';

import { User } from './entities/user.entity';
import { UserService } from './user.service';

@Controller('user')
export class UserController {
  constructor(private readonly UserService: UserService) {}

  @Post('/register')
  create(@Body() userData: CreateUserDto) {
    return this.UserService.create(userData);
  }
}