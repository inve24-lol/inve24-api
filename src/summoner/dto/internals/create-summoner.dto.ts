import { ApiProperty } from '@nestjs/swagger';
import { Exclude, Expose } from 'class-transformer';

@Exclude()
export class CreateSummonerDto {
  @ApiProperty({
    description: '유저 UUID',
  })
  @Expose({ name: 'uuid' })
  readonly userUuid!: string;

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
