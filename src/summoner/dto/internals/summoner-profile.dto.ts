import { BaseDto } from '@common/dto/base.dto';
import { ApiProperty } from '@nestjs/swagger';
import { Exclude, Expose } from 'class-transformer';

@Exclude()
export class SummonerProfileDto extends BaseDto {
  @ApiProperty({
    description: '유저 UUID',
  })
  @Expose()
  readonly userUuuid!: string;

  @ApiProperty({
    description: '암호화된 소환사 PUUID',
  })
  @Expose()
  readonly puuid!: string;

  @ApiProperty({
    description: '소환사 이름',
    example: 'Hide on bush',
  })
  @Expose()
  readonly gameName!: string;

  @ApiProperty({
    description: '소환사 태그',
    example: 'KR1',
  })
  @Expose()
  readonly tagLine!: string;

  @ApiProperty({
    description: '소환사 레벨',
    example: 100,
  })
  @Expose()
  readonly summonerLevel!: number;

  @ApiProperty({
    description: '소환사 프로필 아이콘 ID',
    example: 3543,
  })
  @Expose()
  readonly profileIconId!: number;

  @ApiProperty({
    description: '소환사 티어',
    example: 'CHALLENGER',
    default: 'UNRANKED',
  })
  @Expose()
  readonly tier!: string;

  @ApiProperty({
    description: '소환사 랭크',
    example: 'I',
    default: 'UNRANKED',
  })
  @Expose()
  readonly rank!: string;

  @ApiProperty({
    description: '소환사 리그 점수',
    example: 1000,
    default: 0,
  })
  @Expose()
  readonly leaguePoints!: number;

  @ApiProperty({
    description: '소환사 승리 횟수',
    example: 0,
    default: 0,
  })
  @Expose()
  readonly wins!: number;

  @ApiProperty({
    description: '소환사 패배 횟수',
    example: 0,
    default: 0,
  })
  @Expose()
  readonly losses!: number;
}
