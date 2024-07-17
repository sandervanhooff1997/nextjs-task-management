import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import User from 'src/auth/user.entity';
import CreateTaskDto from './dto/create-task.dto';
import GetTasksFilterDto from './dto/get-tasks-filter.dto';
import UpdateTaskDto from './dto/update-task.dto';
import Task from './task.entity';
import TasksRepository from './tasks.repository';

@Injectable()
export class TasksService {
  constructor(
    @InjectRepository(Task)
    private readonly repository: TasksRepository,
  ) {}

  async getAll(filter: GetTasksFilterDto, user: User): Promise<Task[]> {
    const { status, search } = filter;

    return await this.repository.getAllTasks(status, search, user);
  }

  async getById(id: string, user: User): Promise<Task> {
    const task = await this.repository.findOneBy({ id, user });
    if (!task) {
      throw new NotFoundException();
    }
    return task;
  }

  async create(createTaskDto: CreateTaskDto, user: User): Promise<Task> {
    const { title, description } = createTaskDto;

    return await this.repository.createTask(title, description, user);
  }

  async update(
    id: string,
    updateTaskDto: UpdateTaskDto,
    user: User,
  ): Promise<boolean> {
    const task = await this.getById(id, user);

    task.status = updateTaskDto.status;

    await this.repository.save(task);

    return true;
  }

  async delete(id: string, user: User): Promise<boolean> {
    const result = await this.repository.delete({ id, user });

    if (!result.affected) {
      throw new NotFoundException();
    }

    return true;
  }
}
