import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import AuthCredentialsDto from './dto/auth-credentials.dto';
import JwtAccessToken from './interface/jwt-access-token.interface';

@Controller('auth')
export class AuthController {
  constructor(private readonly service: AuthService) {}

  @Post('/signup')
  async signUp(@Body() credentials: AuthCredentialsDto): Promise<void> {
    return await this.service.signUp(credentials);
  }

  @Post('/signin')
  async signIn(
    @Body() credentials: AuthCredentialsDto,
  ): Promise<JwtAccessToken> {
    return await this.service.signIn(credentials);
  }
}
