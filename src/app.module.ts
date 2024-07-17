import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ConfigService } from '@nestjs/config/dist';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LoggerModule } from 'nestjs-pino';
import { AuthModule } from './auth/auth.module';
import { CommonModule } from './common/common.module';
import { configValidationSchema } from './config.schema';
import { TasksModule } from './tasks/tasks.module';

@Module({
  imports: [
    // whenever we need async values like the config service, we need to use the forRootAsync method
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule], // import the whole module
      inject: [ConfigService], // register ConfigService for DI
      // write a custom factory method returning a config object back to the TypeOrmModule
      useFactory: async (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get('DB_HOST'),
        port: configService.get('DB_PORT'),
        username: configService.get('DB_USERNAME'),
        password: configService.get('DB_PASSWORD'),
        database: configService.get('DB_DATABASE'),
        autoLoadEntities: true, // finds entity files (*.entity.ts) and loads them for you
        synchronize: true, // auto create tables based on entities (dont use in production)
      }),
    }),
    LoggerModule.forRoot({
      pinoHttp: {
        // set the custom log context to HTTP for the http logger
        customProps: (_req, _res) => ({
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
    ConfigModule.forRoot({
      envFilePath: [`./env/.env.${process.env.STAGE}`],
      validationSchema: configValidationSchema,
    }),
    TasksModule,
    AuthModule,
    CommonModule,
  ],
})
export class AppModule {}
