import { createParamDecorator, ExecutionContext } from '@nestjs/common';

/**
 * Decorator to extract the user object from the request.
 * Ensure your route is protected by a Guard that populates request.user.
 */
export const User = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    return request.user;
  },
);
