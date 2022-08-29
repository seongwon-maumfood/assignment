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
import { UserDto } from './dto/user.dto';

import { UserService } from './user.service';

@Controller('user')
export class UserController {
  constructor(private readonly UserService: UserService) {}

  @Post('/register')
  create(@Body() userData: UserDto) {
    return this.UserService.create(userData);
  }

  @Post('/login')
  login(@Body() userData: UserDto) {
    return this.UserService.login(userData);
  }
}
