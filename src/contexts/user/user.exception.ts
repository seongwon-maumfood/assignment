import { HttpException, HttpStatus } from '@nestjs/common';

export class ExistUserException extends HttpException {
  constructor() {
    super('이미 존재하는 닉네임입니다.', HttpStatus.BAD_REQUEST);
  }
}

export class NoUserException extends HttpException {
  constructor() {
    super('해당 유저 정보가 없습니다.', HttpStatus.NOT_FOUND);
  }
}
