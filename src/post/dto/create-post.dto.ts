import { IsArray, IsString } from 'class-validator';

export class CreatePostDto {
  @IsString()
  title: string;
  @IsString()
  content: string;
  
  @IsArray()
  tags:string[];
}
