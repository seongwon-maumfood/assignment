import { IsString, Min } from 'class-validator';

export class UpdateCommentDto {
  @IsString()
  @Min(1)
  content: string;
}
