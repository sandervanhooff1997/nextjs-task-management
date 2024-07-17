import User from 'src/auth/user.entity';
import { Repository } from 'typeorm';
import Task from './task.entity';

export default interface TasksRepository extends Repository<Task> {
  this: Repository<Task>;
  getAllTasks(status: string, search: string, user: User): Promise<Task[]>;
  createTask(title: string, description: string, user: User): Promise<Task>;
}

export const tasksRepository: Pick<TasksRepository, any> = {
  async getAllTasks(
    status: string,
    search: string,
    user: User,
  ): Promise<Task[]> {
    const query = this.createQueryBuilder('task');

    query.where({ user });

    if (status) {
      query.andWhere('task.status = :status', { status });
    }

    if (search) {
      query.andWhere(
        '(LOWER(task.title) LIKE LOWER(:search) OR LOWER(task.description) LIKE LOWER(:search))',
        { search: `%${search}%` },
      );
    }

    return await query.getMany();
  },

  async createTask(
    title: string,
    description: string,
    user: User,
  ): Promise<Task> {
    const task: Task = this.create({ title, description, user });

    return await this.save(task);
  },
};
