import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config/dist';
import {
    getDataSourceToken,
    getRepositoryToken,
    TypeOrmModule
} from '@nestjs/typeorm';
import { AuthModule } from 'src/auth/auth.module';
import { CommonModule } from 'src/common/common.module';
import { DataSource } from 'typeorm';
import Task from './task.entity';
import { TasksController } from './tasks.controller';
import { tasksRepository } from './tasks.repository';
import { TasksService } from './tasks.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([Task]),
    CommonModule,
    AuthModule,
    ConfigModule,
  ],
  controllers: [TasksController],
  providers: [
    TasksService,
    {
      provide: getRepositoryToken(Task),
      inject: [getDataSourceToken()],
      useFactory(datasource: DataSource) {
        return datasource.getRepository(Task).extend(tasksRepository);
      },
    },
  ],
})
export class TasksModule {}
