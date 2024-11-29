import { ApiProperty } from '@nestjs/swagger';
import { Exclude, Expose } from 'class-transformer';

@Exclude()
export class RsoAccessUrlParamsDto {
  @ApiProperty({
    description: 'RSO 클라이언트 ID',
  })
  @Expose({ name: 'clientId' })
  readonly client_id!: string;

  @ApiProperty({
    description: 'RSO 리다이렉트 URI',
  })
  @Expose({ name: 'redirectUri' })
  readonly redirect_uri!: string;

  @ApiProperty({
    description: 'RSO 응답 유형',
  })
  @Expose({ name: 'responseType' })
  readonly response_type!: string;

  @ApiProperty({
    description: 'RSO 요청 권한 범위',
  })
  @Expose()
  readonly scope!: string;
}
