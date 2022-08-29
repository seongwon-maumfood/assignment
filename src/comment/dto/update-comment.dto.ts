import { IsString, Length } from 'class-validator';

export class UpdateCommentDto {
  @IsString()
  @Length(1)
  content: string;
}
