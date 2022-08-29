import {
  MiddlewareConsumer,
  Module,
  NestModule,
  RequestMethod,
} from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaService } from './prisma/prisma.service';
import { UserModule } from './contexts/user/user.module';
import { PostModule } from './contexts/post/post.module';
import { JwtMiddleWare } from './jwt.middleware';
import { JwtService } from '@nestjs/jwt';
import { CommentModule } from './contexts/comment/comment.module';

@Module({
  imports: [UserModule, PostModule, CommentModule],
  controllers: [AppController],
  providers: [AppService, PrismaService, JwtService],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(JwtMiddleWare)
      .forRoutes(
        { path: 'post/*', method: RequestMethod.POST },
        { path: 'post/*', method: RequestMethod.PATCH },
        { path: 'post/*', method: RequestMethod.DELETE },
        { path: 'comment/*', method: RequestMethod.ALL },
      );
  }
}
