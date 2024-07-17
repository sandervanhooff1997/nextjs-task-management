import {
  ConflictException,
  InternalServerErrorException,
} from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { DatabaseErrorCodes } from 'src/common/enums/database-error-codes.enum';
import { Repository } from 'typeorm';
import AuthCredentialsDto from './dto/auth-credentials.dto';
import User from './user.entity';

export default interface UserRepository extends Repository<User> {
  this: Repository<User>;
  createUser(credentials: AuthCredentialsDto): Promise<void>;
}

export const userRepository: Pick<UserRepository, any> = {
  async createUser(credentials: AuthCredentialsDto): Promise<void> {
    const { username, password } = credentials;

    const salt = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash(password, salt);

    const user = await this.create({ username, password: hashedPassword });

    try {
      await this.save(user);
    } catch (error) {
      if (error.code === DatabaseErrorCodes.UniqueViolation) {
        throw new ConflictException('Username already exists');
      }

      throw new InternalServerErrorException();
    }
  },
};
