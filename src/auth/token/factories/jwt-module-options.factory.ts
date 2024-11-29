import jwtConfig from '@core/config/settings/jwt.config';
import { Inject, Injectable } from '@nestjs/common';
import { ConfigType } from '@nestjs/config';
import { JwtModuleOptions, JwtOptionsFactory } from '@nestjs/jwt';

@Injectable()
export class JwtModuleOptionsFactory implements JwtOptionsFactory {
  constructor(@Inject(jwtConfig.KEY) private readonly config: ConfigType<typeof jwtConfig>) {}

  createJwtOptions(): JwtModuleOptions {
    return {
      secret: this.config.jwt.accessToken.secret,
      signOptions: {
        subject: 'access-token',
        expiresIn: this.config.jwt.accessToken.expiresIn,
      },
    };
  }
}
