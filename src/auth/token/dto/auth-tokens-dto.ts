import { IAuthTokens } from '@token/interfaces/auth-tokens.interface';
import { Exclude, Expose } from 'class-transformer';

@Exclude()
export class AuthTokensDto implements IAuthTokens {
  @Expose()
  readonly accessToken!: string;

  @Expose()
  readonly refreshToken!: string;
}
