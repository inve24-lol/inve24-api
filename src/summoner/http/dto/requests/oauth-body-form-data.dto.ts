import { ApiProperty } from '@nestjs/swagger';
import { Exclude, Expose } from 'class-transformer';

@Exclude()
export class OauthBodyFormDataDto {
  @ApiProperty({
    description: 'RSO 인증 방법',
  })
  @Expose({ name: 'grantType' })
  readonly grant_type!: string;

  @ApiProperty({
    description: 'RSO 인증 접근 코드',
  })
  @Expose({ name: 'rsoAccessCode' })
  readonly code!: string;

  @ApiProperty({
    description: 'RSO 리다이렉트 URI',
  })
  @Expose({ name: 'redirectUri' })
  readonly redirect_uri!: string;
}
