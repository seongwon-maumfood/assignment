import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { UserDto } from './dto/user.dto';
import { Response } from '../interface';
import { hash, compare, compareSync } from 'bcrypt';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class UserService {
  constructor(
    private prisma: PrismaService,
    private readonly jwt: JwtService,
  ) {}

  async create(userDto: UserDto): Promise<Response> {
    const isExist = await this.prisma.user.findUnique({
      where: {
        username: userDto.username,
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
    const encryptedPassword = await hash(userDto.password, 10);
    userDto.password = encryptedPassword;

    try {
      await this.prisma.user.create({
        data: {
          username: userDto.username,
          encryptedPassword,
        },
      });

      return {
        success: true,
        data: userDto.username,
        code: '201',
        message: '회원가입 완료.',
      };
    } catch (e) {
      console.log(e);
      return {
        success: false,
        data: null,
        code: '500',
        message: 'Internal server error',
      };
    }
  }

  async login(userDto: UserDto): Promise<Response> {
    try {
      const user = await this.prisma.user.findUnique({
        where: { username: userDto.username },
      });

      if (!user) {
        return {
          success: false,
          data: null,
          code: '400',
          message: '해당 유저 정보가 없습니다.',
        };
      }

      const validatePassword = compareSync(
        userDto.password,
        user.encryptedPassword,
      );

      if (!validatePassword) {
        return {
          success: false,
          data: null,
          code: '400',
          message: '해당 유저 정보가 없습니다.',
        };
      }

      const token = this.jwt.sign(user.id);

      return {
        success: true,
        data: token,
        code: '200',
        message: '로그인 완료.',
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
