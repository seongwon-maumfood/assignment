import { IsNumber, IsOptional, IsString, Max, Min } from 'class-validator';

export class UserDto {
  @IsString()
  @Min(4)
  @Max(16)
  readonly username: string;
  @IsString()
  @Min(4)
  @Max(16)
  password: string;
}
