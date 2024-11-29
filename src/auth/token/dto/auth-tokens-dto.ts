import { Exclude, Expose } from 'class-transformer';

@Exclude()
export class AuthTokensDto {
  @Expose()
  readonly accessToken!: string;

  @Expose()
  readonly refreshToken!: string;
}
