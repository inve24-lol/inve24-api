import { ApiProperty } from '@nestjs/swagger';
import { Exclude, Expose } from 'class-transformer';

@Exclude()
export class RsoApiResponseDto {
  @ApiProperty({
    description: '라이엇 계정 인증 엑세스 토큰',
  })
  @Expose()
  readonly access_token!: string;

  @ApiProperty({
    description: '라이엇 계정 인증 토큰 유형',
  })
  @Expose()
  readonly token_type!: string;
}
