import { IsString } from 'class-validator';

export class CreateCommentDto {
  @IsString()
  target: string;
  @IsString()
  content: string;
}
