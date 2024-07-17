import { Injectable, Logger } from '@nestjs/common';
import { UnauthorizedException } from '@nestjs/common/exceptions/unauthorized.exception';
import { JwtService } from '@nestjs/jwt/dist';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcrypt';
import AuthCredentialsDto from './dto/auth-credentials.dto';
import JwtAccessToken from './interface/jwt-access-token.interface';
import JwtPayload from './interface/jwt-payload.interface';
import User from './user.entity';
import UserRepository from './users.repository';

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);

  constructor(
    @InjectRepository(User) private readonly repository: UserRepository,
    private readonly jwtService: JwtService,
  ) {}

  async signUp(credentials: AuthCredentialsDto): Promise<void> {
    await this.repository.createUser(credentials);
  }

  async signIn(credentials: AuthCredentialsDto): Promise<JwtAccessToken> {
    const { username, password } = credentials;
    const user = await this.repository.findOneBy({ username });

    if (user && (await bcrypt.compare(password, user.password))) {
      const payload: JwtPayload = { username };
      const accessToken = this.jwtService.sign(payload);

      return { accessToken } as JwtAccessToken;
    } else {
      throw new UnauthorizedException();
    }
  }
}
