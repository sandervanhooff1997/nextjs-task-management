import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LoggerModule } from 'nestjs-pino';
import { AuthModule } from './auth/auth.module';
import { CommonModule } from './common/common.module';
import { TasksModule } from './tasks/tasks.module';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      username: 'postgres',
      password: 'postgres',
      database: 'task-management',
      autoLoadEntities: true, // finds entity files (*.entity.ts) and loads them for you
      // entities: [Task], // no need to manually load entities if autoLoadEntities is set to true
      synchronize: true, // auto create tables based on entities (dont use in production)
    }),
    LoggerModule.forRoot({
      pinoHttp: {
        // set the custom log context to HTTP for the http logger
        customProps: (req, res) => ({
          context: 'HTTP',
        }),
        transport: {
          target: 'pino-pretty',
          options: {
            singleLine: true,
          },
        },
      },
    }),
    TasksModule,
    AuthModule,
    CommonModule,
  ],
})
export class AppModule {}
