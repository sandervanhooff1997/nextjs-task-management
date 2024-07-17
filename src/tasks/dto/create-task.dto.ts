import { IsNotEmpty, MinLength } from 'class-validator';

export default class CreateTaskDto {
  @IsNotEmpty()
  @MinLength(3)
  title: string;

  description: string;
}
