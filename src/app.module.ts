import {
  MiddlewareConsumer,
  Module,
  NestModule,
  RequestMethod,
} from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaService } from './prisma/prisma.service';
import { UserModule } from './user/user.module';
import { BoardModule } from './board/board.module';
import { JwtMiddleWare } from './jwt.middleware';
import { JwtService } from '@nestjs/jwt';

@Module({
  imports: [UserModule, BoardModule],
  controllers: [AppController],
  providers: [AppService, PrismaService, JwtService],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(JwtMiddleWare).forRoutes({
      path: 'board',
      method: RequestMethod.ALL,
    });
  }
}
