import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateUserDto } from './dto/create-user.dto';
import { Response } from '../interface';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UserService {
  constructor(private prisma: PrismaService) {}

  async create(CreateUserDto: CreateUserDto): Promise<Response> {
    const isExist = await this.prisma.user.findUnique({
      where: {
        username: CreateUserDto.username,
      },
    });

    if (isExist) {
      return {
        success: false,
        data: null,
        code: '400',
        message: '이미 존재하는 닉네임입니다.',
      };
    }
    const encryptedPassword = await bcrypt.hash(CreateUserDto.password, 10);
    CreateUserDto.password = encryptedPassword;

    try {
      const user = await this.prisma.user.create({
        data: {
          username: CreateUserDto.username,
          encryptedPassword,
        },
      });
      // 토큰값 줄것
      return {
        success: true,
        data: CreateUserDto.username,
        code: '201',
        message: '회원가입 완료.',
      };
    } catch (e) {
      console.log(e);
      return {
        success: false,
        data: null,
        code: '500',
        message: 'internal server error',
      };
    }
  }
}
