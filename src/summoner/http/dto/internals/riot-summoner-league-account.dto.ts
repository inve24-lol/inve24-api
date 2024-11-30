import { FetchRiotAccountResponseDto } from '@http/dto/responses/fetch-riot-account-response.dto';
import { FetchRiotSummonerResponseDto } from '@http/dto/responses/fetch-riot-summoner-response.dto';
import { FetchRiotLeagueResponseDto } from '@http/dto/responses/fetch-riot-league-response.dto';
import { ApiProperty } from '@nestjs/swagger';
import { Exclude, Expose } from 'class-transformer';

@Exclude()
export class RiotSummonerLeagueAccountDto {
  @ApiProperty({
    description: '라이엇 계정 정보',
  })
  @Expose()
  readonly riotAccountInfo!: FetchRiotAccountResponseDto;

  @ApiProperty({
    description: '라이엇 소환사 정보',
  })
  @Expose()
  readonly riotSummonerInfo!: FetchRiotSummonerResponseDto;

  @ApiProperty({
    description: '라이엇 소환사 리그 정보',
  })
  @Expose()
  readonly riotLeagueInfo!: FetchRiotLeagueResponseDto;
}
