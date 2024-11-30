import { ApiProperty } from '@nestjs/swagger';
import { SummonerProfileDto } from '@summoner/dto/internals/summoner-profile.dto';
import { Exclude, Expose } from 'class-transformer';

@Exclude()
export class FindSummonersResponseDto {
  @ApiProperty({
    description: '소환사 프로필 목록',
    type: [SummonerProfileDto],
  })
  @Expose()
  readonly summonerProfiles!: SummonerProfileDto[];
}
