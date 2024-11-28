import jwtConfig from '@core/config/jwt.config';
import { Inject, UnauthorizedException } from '@nestjs/common';
import { ConfigType } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { AuthPayloadDto } from '@token/dto/auth-payload.dto';
import { PayloadDto } from '@token/dto/payload.dto';
import { TokenService } from '@token/services/token.service';
import { UserProfileDto } from '@users/dto/internals/user-profile.dto';
import { UsersService } from '@users/services/users.service';
import { plainToInstance } from 'class-transformer';
import { Request } from 'express';
import { ExtractJwt, Strategy } from 'passport-jwt';

export class JwtRefreshTokenStrategy extends PassportStrategy(Strategy, 'jwt-refresh') {
  constructor(
    private readonly tokenService: TokenService,
    private readonly usersService: UsersService,
    @Inject(jwtConfig.KEY) private readonly config: ConfigType<typeof jwtConfig>,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([(request) => request?.cookies?.refreshToken]),
      ignoreExpiration: false,
      secretOrKey: config.jwt.refreshToken.secret,
      passReqToCallback: true,
    });
  }

  async validate(request: Request, authPayload: AuthPayloadDto): Promise<PayloadDto> {
    const { refreshToken } = request.cookies;
    const response = request.res;
    const { uuid } = authPayload;

    try {
      // 401 에러 발생 시, catch문에서 로그아웃 처리
      await this.tokenService.verifyRefreshToken(uuid, refreshToken);

      const userProfile: UserProfileDto = await this.usersService.getUserProfileByUuid(uuid);

      return plainToInstance(PayloadDto, userProfile);
    } catch (error) {
      if (error instanceof UnauthorizedException) response?.clearCookie('refreshToken');

      throw error;
    }
  }
}
