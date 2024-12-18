import { Role } from '@common/constants/roles.enum';
import { ROLES_KEY } from '@common/constants/roles.key';
import { CanActivate, ExecutionContext, ForbiddenException, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Observable } from 'rxjs';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
    const roles = this.reflector.getAllAndOverride<Role[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (!roles) return true;

    const { user } = context.switchToHttp().getRequest();

    const hasRole = roles.some((role) => role === user.role);

    if (!hasRole) throw new ForbiddenException('해당 리소스에 접근할 수 있는 권한이 없습니다.');

    return hasRole;
  }
}
