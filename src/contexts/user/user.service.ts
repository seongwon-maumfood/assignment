import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { UserDto } from './dto/user.dto';
import { hash, compareSync } from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { ExistUserException, NoUserException } from './user.exception';

@Injectable()
export class UserService {
  constructor(
    private prisma: PrismaService,
    private readonly jwt: JwtService,
  ) {}

  async create(userDto: UserDto) {
    const isExist = await this.prisma.user.findUnique({
      where: {
        username: userDto.username,
      },
    });

    if (isExist) throw new ExistUserException();
    const encryptedPassword = await hash(userDto.password, 10);
    userDto.password = encryptedPassword;

    await this.prisma.user.create({
      data: {
        username: userDto.username,
        encryptedPassword,
      },
    });

    return { result: userDto.username, message: '회원가입 완료' };
  }

  async login(userDto: UserDto) {
    const user = await this.prisma.user.findUnique({
      where: { username: userDto.username },
    });

    if (!user) throw new NoUserException();

    const validatePassword = compareSync(
      userDto.password,
      user.encryptedPassword,
    );

    if (!validatePassword) throw new NoUserException();

    const token = this.jwt.sign(user.id);

    return { result: token, message: '로그인 완료' };
  }
}
