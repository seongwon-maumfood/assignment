import { HttpException, HttpStatus } from '@nestjs/common';

export class InvalidUserException extends HttpException {
  constructor() {
    super('댓글 작성자만 수정/삭제 할 수 있습니다.', HttpStatus.BAD_REQUEST);
  }
}

export class NoCommentException extends HttpException {
  constructor() {
    super('해당 댓글을 찾을 수 없습니다.', HttpStatus.NOT_FOUND);
  }
}
