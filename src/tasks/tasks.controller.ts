import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query
} from '@nestjs/common';
import { UseGuards } from '@nestjs/common/decorators';
import { AuthGuard } from '@nestjs/passport';
import { GetUser } from 'src/auth/get-user.decorator';
import User from 'src/auth/user.entity';
import CreateTaskDto from './dto/create-task.dto';
import GetTasksFilterDto from './dto/get-tasks-filter.dto';
import UpdateTaskDto from './dto/update-task.dto';
import Task from './task.entity';
import { TasksService } from './tasks.service';

@Controller('tasks')
@UseGuards(AuthGuard())
export class TasksController {
  constructor(private readonly tasksService: TasksService) {}

  @Get()
  async getAll(
    @Query() filterDto: GetTasksFilterDto,
    @GetUser() user: User,
  ): Promise<Task[]> {
    return await this.tasksService.getAll(filterDto, user);
  }

  @Get(':id')
  async getById(@Param('id') id: string, @GetUser() user: User): Promise<Task> {
    return this.tasksService.getById(id, user);
  }

  @Post()
  async create(
    @Body() task: CreateTaskDto,
    @GetUser() user: User,
  ): Promise<Task> {
    return await this.tasksService.create(task, user);
  }

  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body() task: UpdateTaskDto,
    @GetUser() user: User,
  ): Promise<boolean> {
    return await this.tasksService.update(id, task, user);
  }

  @Delete(':id')
  async delete(
    @Param('id') id: string,
    @GetUser() user: User,
  ): Promise<boolean> {
    return await this.tasksService.delete(id, user);
  }
}
