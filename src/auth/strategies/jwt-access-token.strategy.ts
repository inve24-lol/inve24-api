import jwtConfig from '@config/settings/jwt.config';
import { PayloadDto } from '@common/dto/payload.dto';
import { Inject } from '@nestjs/common';
import { ConfigType } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { UserProfileDto } from '@users/dto/internals/user-profile.dto';
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

    await this.usersService.verifyPayload(uuid);

    const userProfile: UserProfileDto = await this.usersService.getUserProfileByUuid(uuid);

    return plainToInstance(PayloadDto, userProfile);
  }
}
