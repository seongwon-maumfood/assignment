import { IsString, Length } from 'class-validator';

export class CreateCommentDto {
  @IsString()
  target: string;
  @IsString()
  @Length(1)
  content: string;
}
