import { Injectable, NestMiddleware, Options } from '@nestjs/common';
import { NextFunction, Request, Response } from 'express';
import { JwtService } from '@nestjs/jwt';
import { UserController } from './user/user.controller';
import { PrismaService } from './prisma/prisma.service';

@Injectable()
export class JwtMiddleWare implements NestMiddleware<Request, Response> {
  constructor(
    private readonly jwtService: JwtService,
    private readonly prisma: PrismaService,
  ) {}
  async use(req: Request, res: Response, next: NextFunction) {
    const { authorization } = req.headers;
    if (!authorization) {
      return;
    }
    const [type, value] = authorization.split(' ');
    if (type !== 'Bearer') {
      return {
        success: false,
        data: null,
        code: '401',
        message: '유효하지 않은 토큰입니다.',
      };
    }
    if (!value) {
        return {
            success: false,
            data: null,
            code: '401',
            message: '유효하지 않은 토큰입니다.',
          };
    }
    try {
      const userid = this.jwtService.verify(value, { secret: 'sw123123' });
      const user = await this.prisma.user.findUnique({ where: { id:userid } });
      if (!user) {
        return {
            success: false,
            data: null,
            code: '401',
            message: '유효하지 않은 토큰입니다.',
          };
      }
      req['user'] = user.id;
      next();
    } catch (e) {
      console.log(e);
      return {
        success: false,
        data: null,
        code: '500',
        message: 'Internal server error.',
      };
    }
  }
}
