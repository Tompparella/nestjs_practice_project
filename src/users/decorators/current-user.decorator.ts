import { createParamDecorator, ExecutionContext } from '@nestjs/common';

// This exposes the currentUser provided in the request by current-user.interceptor
export const CurrentUser = createParamDecorator(
  (data: never, context: ExecutionContext) => {
    const request = context.switchToHttp().getRequest();
    return request.currentUser;
  },
);
