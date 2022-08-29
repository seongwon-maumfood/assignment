import { Controller, Body, Post, UseInterceptors } from '@nestjs/common';
import { UserDto } from './dto/user.dto';
import {
  createUserInterceptor,
  userLoginInterceptor,
} from './user.interceptor';

import { UserService } from './user.service';

@Controller('user')
export class UserController {
  constructor(private readonly UserService: UserService) {}

  @Post('/register')
  @UseInterceptors(createUserInterceptor)
  create(@Body() userData: UserDto) {
    return this.UserService.create(userData);
  }

  @Post('/login')
  @UseInterceptors(userLoginInterceptor)
  login(@Body() userData: UserDto) {
    return this.UserService.login(userData);
  }
}
