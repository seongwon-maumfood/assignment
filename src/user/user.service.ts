import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { PrismaClient, Prisma } from '@prisma/client'
import { User } from './entities/user.entity';
const prisma = new PrismaClient()


@Injectable()
export class UserService {

}

