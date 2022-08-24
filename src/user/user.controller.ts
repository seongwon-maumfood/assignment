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

//성능향상을위해서 fastify가 최고다(express의 약 2배)
@Controller('user')
export class UserController {
  constructor(private readonly UserService: UserService) {}

  @Post()
  create(@Body() userData: CreateUserDto) {
    return this.UserService.create(userData);
  }
}