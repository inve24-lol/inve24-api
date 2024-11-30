import { ApiProperty } from '@nestjs/swagger';
import { Exclude, Expose } from 'class-transformer';

@Exclude()
export class RiotLeagueApiResponseDto {
  @ApiProperty({
    description: '소환사 티어',
  })
  @Expose()
  readonly tier!: string;

  @ApiProperty({
    description: '소환사 랭크',
  })
  @Expose()
  readonly rank!: string;

  @ApiProperty({
    description: '소환사 리그 점수',
  })
  @Expose()
  readonly leaguePoints!: number;

  @ApiProperty({
    description: '소환사 승리 횟수',
  })
  @Expose()
  readonly wins!: number;

  @ApiProperty({
    description: '소환사 패배 횟수',
  })
  @Expose()
  readonly losses!: number;
}
