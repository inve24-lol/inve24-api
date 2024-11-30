import { ApiProperty } from '@nestjs/swagger';
import { Exclude, Expose } from 'class-transformer';

@Exclude()
export class FetchRiotSummonerResponseDto {
  @ApiProperty({
    description: '암호화된 소환사 ID',
  })
  @Expose()
  readonly id!: string;

  @ApiProperty({
    description: '소환사 레벨',
  })
  @Expose()
  readonly summonerLevel!: number;

  @ApiProperty({
    description: '소환사 프로필 아이콘 ID',
  })
  @Expose()
  readonly profileIconId!: number;
}
