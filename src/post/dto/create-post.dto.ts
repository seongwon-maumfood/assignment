import { IsArray, IsString, Min } from 'class-validator';

export class CreatePostDto {
  @IsString()
  @Min(1)
  title: string;
  @IsString()
  content: string;

  @IsArray()
  tags: string[];
}
