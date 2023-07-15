import { CanActivate, ExecutionContext } from '@nestjs/common';
import { User } from '../users/entities';

export class AdminGuard implements CanActivate {
  canActivate(context: ExecutionContext) {
    const request = context.switchToHttp().getRequest();
    const user: User = request.currentUser;
    return !!user && user.admin;
  }
}
