import { ApiProperty } from '@nestjs/swagger';
import { Exclude, Expose } from 'class-transformer';

@Exclude()
export class RsoPostBodyFormDto {
  @ApiProperty({
    description: 'RSO 인증 방법',
  })
  @Expose()
  readonly grant_type!: string;

  @ApiProperty({
    description: 'RSO 인증 접근 코드',
  })
  @Expose()
  readonly code!: string;

  @ApiProperty({
    description: 'RSO 리다이렉트 URI',
  })
  @Expose()
  readonly redirect_uri!: string;
}
