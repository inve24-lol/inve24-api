import { PayloadDto } from '@common/dto/payload.dto';
import bcryptConfig from '@config/settings/bcrypt.config';
import jwtConfig from '@config/settings/jwt.config';
import redisConfig from '@config/settings/redis.config';
import { ITokenCacheRepository } from '@core/redis/abstracts/token-cache-repository.abstract';
import { Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigType } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { AuthPayloadDto } from '@token/dto/auth-payload.dto';
import { AuthTokensDto } from '@token/dto/auth-tokens-dto';
import bcrypt from 'bcrypt';
import { plainToInstance } from 'class-transformer';

@Injectable()
export class TokenService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly tokenCacheRepository: ITokenCacheRepository,
    @Inject(jwtConfig.KEY) private readonly tokenConfig: ConfigType<typeof jwtConfig>,
    @Inject(bcryptConfig.KEY) private readonly hashConfig: ConfigType<typeof bcryptConfig>,
    @Inject(redisConfig.KEY) private readonly cacheConfig: ConfigType<typeof redisConfig>,
  ) {}

  async generateTokens(payload: PayloadDto, authPayload: AuthPayloadDto): Promise<AuthTokensDto> {
    const accessToken = this.generateAccessToken(payload);

    const refreshToken = await this.generateRefreshToken(authPayload);

    return plainToInstance(AuthTokensDto, { accessToken, refreshToken });
  }

  async verifyRefreshToken(uuid: string, refreshToken: string): Promise<void> {
    const redisHashedRefreshToken = await this.tokenCacheRepository.getToken(uuid);

    // strategy에서 로그아웃 처리
    if (!redisHashedRefreshToken)
      throw new UnauthorizedException(
        '잘못된 접근입니다. 다시 로그인하여 새로운 토큰을 발급받으세요.',
      );

    const isRefreshTokenMatched = await bcrypt.compare(refreshToken, redisHashedRefreshToken);

    // strategy에서 로그아웃 처리
    // 두 개의 클라이언트에서 사용자가 로그인한 경우,
    // 첫 번째 로그인 클라이언트를 사용하여 액세스 토큰을 재발급하려고 할 때 반환되는 에러
    if (!isRefreshTokenMatched)
      throw new UnauthorizedException(
        '다른 장치에서 로그인되어 해당 세션을 사용할 수 없습니다. 다시 로그인하여 새로운 토큰을 발급받으세요.',
      );
  }

  async deleteRefreshToken(payload: PayloadDto): Promise<void> {
    const { uuid } = payload;

    await this.tokenCacheRepository.delToken(uuid);
  }

  generateAccessToken(payload: PayloadDto): string {
    return this.jwtService.sign({ ...payload });
  }

  private async generateRefreshToken(authPayload: AuthPayloadDto): Promise<string> {
    const refreshToken = this.jwtService.sign(
      { ...authPayload },
      {
        secret: this.tokenConfig.jwt.refreshToken.secret,
        subject: 'refresh-token',
        expiresIn: this.tokenConfig.jwt.refreshToken.expiresIn,
      },
    );

    await this.createRefreshToken(authPayload, refreshToken);

    return refreshToken;
  }

  private async createRefreshToken(
    authPayload: AuthPayloadDto,
    refreshToken: string,
  ): Promise<void> {
    const { uuid } = authPayload;

    const hashedRefreshToken = await bcrypt.hash(
      refreshToken,
      this.hashConfig.bcrypt.refreshTokenSalt,
    );

    await this.tokenCacheRepository.setToken(
      uuid,
      hashedRefreshToken,
      this.cacheConfig.redis.refreshToken.ttl,
    );
  }
}
