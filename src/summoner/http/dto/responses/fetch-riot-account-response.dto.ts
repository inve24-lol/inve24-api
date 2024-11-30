import { ApiProperty } from '@nestjs/swagger';
import { Exclude, Expose } from 'class-transformer';

@Exclude()
export class FetchRiotAccountResponseDto {
  @ApiProperty({
    description: '암호화된 소환사 PUUID',
  })
  @Expose()
  readonly puuid!: string;

  @ApiProperty({
    description: '소환사 이름',
  })
  @Expose()
  readonly gameName!: string;

  @ApiProperty({
    description: '소환사 태그',
  })
  @Expose()
  readonly tagLine!: string;
}
