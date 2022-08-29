import { IsString, Min } from 'class-validator';

export class CreateCommentDto {
  @IsString()
  target: string;
  @IsString()
  @Min(1)
  content: string;
}
