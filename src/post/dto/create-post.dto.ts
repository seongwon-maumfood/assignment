import { IsArray, IsString, Length } from 'class-validator';

export class CreatePostDto {
  @IsString()
  @Length(1)
  title: string;
  @IsString()
  @Length(1)
  content: string;

  @IsArray()
  tags: string[];
}
