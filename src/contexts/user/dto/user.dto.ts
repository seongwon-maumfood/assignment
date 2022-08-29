import { IsString, Length } from 'class-validator';

export class UserDto {
  @IsString()
  @Length(4, 16)
  readonly username: string;
  @IsString()
  @Length(4, 16)
  password: string;
}
