import { createParamDecorator, ExecutionContext } from '@nestjs/common';

// custom decorators
export const CurrentUser = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    return request.user;
  },
);
