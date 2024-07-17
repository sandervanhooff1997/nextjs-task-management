import { Module } from '@nestjs/common';
import {
  getDataSourceToken,
  getRepositoryToken,
  TypeOrmModule,
} from '@nestjs/typeorm';
import { AuthModule } from 'src/auth/auth.module';
import { CommonModule } from 'src/common/common.module';
import { DataSource } from 'typeorm';
import Task from './task.entity';
import { TasksController } from './tasks.controller';
import { taskRepository } from './tasks.repository';
import { TasksService } from './tasks.service';

@Module({
  imports: [TypeOrmModule.forFeature([Task]), CommonModule, AuthModule],
  controllers: [TasksController],
  providers: [
    TasksService,
    {
      provide: getRepositoryToken(Task),
      inject: [getDataSourceToken()],
      useFactory(datasource: DataSource) {
        return datasource.getRepository(Task).extend(taskRepository);
      },
    },
  ],
})
export class TasksModule {}