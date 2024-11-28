import { ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { AuthPayloadDto } from '@token/dto/auth-payload.dto';
import { TokenExpiredError, JsonWebTokenError } from 'jsonwebtoken';
import { Observable } from 'rxjs';

@Injectable()
export class JwtAccessTokenGuard extends AuthGuard('jwt-access') {
  handleRequest<TUser = AuthPayloadDto>(
    err: Error | null,
    user: TUser | null,
    info: TokenExpiredError | JsonWebTokenError | any,
  ): TUser {
    if (err) throw err;

    if (info?.message === 'No auth token')
      throw new UnauthorizedException('엑세스 토큰이 필요합니다.');

    if (info instanceof TokenExpiredError)
      throw new UnauthorizedException('엑세스 토큰이 만료되었습니다.');

    if (info instanceof JsonWebTokenError)
      throw new UnauthorizedException(
        '엑세스 토큰이 유효하지 않습니다. 유효한 토큰을 제공해 주세요.',
      );

    if (info || !user) throw new UnauthorizedException('Authentication failed.');

    return user;
  }

  canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
    return super.canActivate(context);
  }
}
