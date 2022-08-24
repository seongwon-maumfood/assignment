import { PrismaService } from '../prisma/prisma.service';
import { Injectable } from '@nestjs/common';
import { CreateUserDto } from 'src/user/dto/create-user.dto';

@Injectable()
export class UserRepository {
  constructor(private prisma: PrismaService) {}

  async create(CreateUserDto: CreateUserDto) {
    const { username, encryptedPassword } = CreateUserDto;

    return await this.prisma.user.create({
      data: {
        username,
        encryptedPassword,
      },
    });
  }
}
