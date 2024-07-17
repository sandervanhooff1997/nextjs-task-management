import { IsEnum } from 'class-validator';
import { TaskStatus } from '../task-status.enum';

export default class UpdateTaskDto {
  @IsEnum(TaskStatus)
  status: TaskStatus;
}
