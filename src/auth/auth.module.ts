import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import {
  getDataSourceToken,
  getRepositoryToken,
  TypeOrmModule,
} from '@nestjs/typeorm';
import { CommonModule } from 'src/common/common.module';
import { DataSource } from 'typeorm';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import JwtStrategy from './jwt.strategy';
import User from './user.entity';
import { userRepository } from './users.repository';

@Module({
  imports: [
    ConfigModule,
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get('JWT_SECRET'),
        signOptions: {
          expiresIn: 3600,
        },
      }),
    }),
    TypeOrmModule.forFeature([User]),
    CommonModule,
  ],
  providers: [
    AuthService,
    JwtStrategy, // provide it as a DI class
    {
      provide: getRepositoryToken(User),
      inject: [getDataSourceToken(), ConfigService],
      useFactory(datasource: DataSource) {
        return datasource.getRepository(User).extend(userRepository);
      },
    },
  ],
  controllers: [AuthController],
  exports: [JwtStrategy, PassportModule],
})
export class AuthModule {}
