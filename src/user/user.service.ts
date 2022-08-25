import { Injectable, NotFoundException } from '@nestjs/common';
import { UserRepository } from '../repository/user.repository';
import { CreateUserDto } from './dto/create-user.dto';
import { User } from './entities/user.entity';

@Injectable()
export class UserService {
constructor(private UserRepository:UserRepository){}

async create(CreateUserDto: CreateUserDto){

}
}

