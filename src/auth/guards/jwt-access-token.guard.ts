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
    if (err) throw new UnauthorizedException('An error occurred during authentication.');

    if (info?.message === 'No auth token')
      throw new UnauthorizedException('The access token is required.');

    if (info instanceof TokenExpiredError)
      throw new UnauthorizedException('The access token has expired.');

    if (info instanceof JsonWebTokenError)
      throw new UnauthorizedException('The access token is invalid. Please provide a valid token.');

    if (info || !user) throw new UnauthorizedException('Invalid access token.');

    return user;
  }

  canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
    return super.canActivate(context);
  }
}
