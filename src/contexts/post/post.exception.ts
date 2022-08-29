import { HttpException, HttpStatus } from '@nestjs/common';

export class InvalidUserException extends HttpException {
  constructor() {
    super('게시글 작성자만 수정/삭제 할 수 있습니다.', HttpStatus.BAD_REQUEST);
  }
}

export class NoPostException extends HttpException {
  constructor() {
    super('NOT_FOUND.', HttpStatus.NOT_FOUND);
  }
}
