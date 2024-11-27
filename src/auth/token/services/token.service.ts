import bcryptConfig from '@core/config/bcrypt.config';
import jwtConfig from '@core/config/jwt.config';
import { ITokenRepository } from '@core/type-orm/abstracts/token-repository.abstract';
import { Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigType } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { AuthPayloadDto } from '@token/dto/auth-payload.dto';
import { AuthTokensDto } from '@token/dto/auth-tokens-dto';
import { PayloadDto } from '@token/dto/payload.dto';
import bcrypt from 'bcrypt';
import { plainToInstance } from 'class-transformer';

@Injectable()
export class TokenService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly tokenRepository: ITokenRepository,
    @Inject(jwtConfig.KEY) private readonly config: ConfigType<typeof jwtConfig>,
    @Inject(bcryptConfig.KEY) private readonly hashConfig: ConfigType<typeof bcryptConfig>,
  ) {}

  async generateTokens(payload: PayloadDto, authPayload: AuthPayloadDto): Promise<AuthTokensDto> {
    const accessToken = this.generateAccessToken(payload);

    const refreshToken = await this.generateRefreshToken(authPayload);

    return plainToInstance(AuthTokensDto, { accessToken, refreshToken });
  }

  async verifyRefreshToken(
    authPayload: AuthPayloadDto,
    refreshToken: string,
  ): Promise<{ uuid: string }> {
    const { uuid: userUuid } = authPayload;

    const token = await this.tokenRepository.findTokenByUserUuid(userUuid);

    if (!token)
      throw new UnauthorizedException('The user is invalid. Please ensure you are signed in.');

    const { refreshToken: hashedRefreshToken, userUuid: uuid } = token;

    const isRefreshTokenMatched = await bcrypt.compare(refreshToken, hashedRefreshToken);

    // When a user is signed in from two clients, this is the error returned when attempting to reissue an access token using the first signed-in client.
    if (!isRefreshTokenMatched)
      throw new UnauthorizedException(
        'Your session has been invalidated due to a new sign-in from another client. Please sign in again to continue.',
      );

    return { uuid };
  }

  async deleteRefreshToken(payload: PayloadDto): Promise<void> {
    const { uuid: userUuid } = payload;

    const { affected } = await this.tokenRepository.deleteToken(userUuid);

    if (!affected) throw new UnauthorizedException('The refresh token has already been deleted.');
  }

  generateAccessToken(payload: PayloadDto): string {
    return this.jwtService.sign({ payload });
  }

  private async generateRefreshToken(authPayload: AuthPayloadDto): Promise<string> {
    const refreshToken = this.jwtService.sign(
      { authPayload },
      {
        secret: this.config.jwt.refreshToken.secret,
        subject: 'refresh-token',
        expiresIn: this.config.jwt.refreshToken.expiresIn,
      },
    );

    await this.createRefreshToken(authPayload, refreshToken);

    return refreshToken;
  }

  private async createRefreshToken(
    authPayload: AuthPayloadDto,
    refreshToken: string,
  ): Promise<void> {
    const { uuid: userUuid } = authPayload;

    const hashedRefreshToken = await bcrypt.hash(
      refreshToken,
      this.hashConfig.bcrypt.refreshTokenSalt,
    );

    await this.tokenRepository.upsertToken(userUuid, hashedRefreshToken);
  }
}
