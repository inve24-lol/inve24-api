import { SignInRequestDto } from '@auth/dto/requests/sign-in-request.dto';
import { RefreshResponseDto } from '@auth/dto/responses/refresh-response.dto';
import { SignInResponseDto } from '@auth/dto/responses/sign-in-response.dto';
import { PayloadDto } from '@common/dto/payload.dto';
import { Injectable } from '@nestjs/common';
import { AuthPayloadDto } from '@token/dto/auth-payload.dto';
import { AuthTokensDto } from '@token/dto/auth-tokens-dto';
import { TokenService } from '@token/services/token.service';
import { UserProfileDto } from '@users/dto/internals/user-profile.dto';
import { UsersService } from '@users/services/users.service';
import { plainToInstance } from 'class-transformer';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly tokenService: TokenService,
  ) {}

  async signInUser(
    signInRequest: SignInRequestDto,
  ): Promise<{ signInResponse: SignInResponseDto; refreshToken: string }> {
    const { email, password } = signInRequest;

    const userProfile: UserProfileDto = await this.usersService.verifyUser(email, password);

    const { accessToken, refreshToken }: AuthTokensDto = await this.signInToken(userProfile);

    const signInResponse = plainToInstance(SignInResponseDto, { userProfile, accessToken });

    return { signInResponse, refreshToken };
  }

  async signOutUser(payload: PayloadDto): Promise<void> {
    await this.tokenService.deleteRefreshToken(payload);
  }

  async refreshUser(payload: PayloadDto): Promise<RefreshResponseDto> {
    const accessToken = this.tokenService.generateAccessToken(payload);

    return plainToInstance(RefreshResponseDto, { accessToken });
  }

  private async signInToken(userProfile: UserProfileDto): Promise<AuthTokensDto> {
    const payload: PayloadDto = plainToInstance(PayloadDto, userProfile);

    const authPayload: AuthPayloadDto = plainToInstance(AuthPayloadDto, userProfile);

    return await this.tokenService.generateTokens(payload, authPayload);
  }
}
