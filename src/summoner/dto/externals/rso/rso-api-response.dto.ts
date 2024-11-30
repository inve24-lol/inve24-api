import { ApiProperty } from '@nestjs/swagger';
import { Exclude, Expose } from 'class-transformer';

@Exclude()
export class RsoApiResponseDto {
  @ApiProperty({
    description: '라이엇 계정 인증 토큰 유형',
  })
  @Expose({ name: 'token_type' })
  readonly tokenType!: string;

  @ApiProperty({
    description: '라이엇 계정 인증 엑세스 토큰',
  })
  @Expose({ name: 'access_token' })
  readonly accessToken!: string;
}
