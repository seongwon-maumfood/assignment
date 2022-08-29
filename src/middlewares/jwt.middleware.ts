import { Injectable, NestMiddleware } from '@nestjs/common';
import { NextFunction, Request, Response } from 'express';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../prisma/prisma.service';
import { UnauthorizedException } from './jwt.exceptions';

@Injectable()
export class JwtMiddleWare implements NestMiddleware<Request, Response> {
  constructor(
    private readonly jwtService: JwtService,
    private readonly prisma: PrismaService,
  ) {}
  async use(req: Request, res: Response, next: NextFunction) {
    const { authorization } = req.headers;
    if (!authorization) throw new UnauthorizedException();
    const [type, value] = authorization.split(' ');
    if (type !== 'Bearer' || !value) throw new UnauthorizedException();

    const userid = this.jwtService.verify(value, { secret: 'sw123123' });
    const user = await this.prisma.user.findUnique({ where: { id: userid } });
    if (!user) throw new UnauthorizedException();
    req['user'] = user.id;
    next();
  }
}
