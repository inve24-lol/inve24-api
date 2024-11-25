import jwtConfig from '@core/config/jwt.config';
import { Inject } from '@nestjs/common';
import { ConfigType } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { PayloadDto } from '@token/dtos/payload.dto';
import { UserProfileDto } from '@users/dtos/internals/user-profile.dto';
import { UsersService } from '@users/services/users.service';
import { plainToInstance } from 'class-transformer';
import { ExtractJwt, Strategy } from 'passport-jwt';

export class JwtAccessTokenStrategy extends PassportStrategy(Strategy, 'jwt-access') {
  constructor(
    private readonly usersService: UsersService,
    @Inject(jwtConfig.KEY) private readonly config: ConfigType<typeof jwtConfig>,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: config.jwt.accessToken.secret,
    });
  }

  async validate(payload: PayloadDto): Promise<PayloadDto> {
    const { uuid } = payload;

    const userProfile: UserProfileDto = await this.usersService.getUserProfileByUuid(uuid);

    return plainToInstance(PayloadDto, userProfile);
  }
}
