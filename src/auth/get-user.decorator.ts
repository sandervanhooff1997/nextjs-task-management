import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import User from './user.entity';

// every authenticated request (using @UseGuards(AuthGuard())) will have a user object attached to the request object
export const GetUser = createParamDecorator(
  (_data, ctx: ExecutionContext): User => {
    const req = ctx.switchToHttp().getRequest();
    return req.user;
  },
);
