import { ApiProperty } from '@nestjs/swagger';
import { SummonerProfileDto } from '@summoner/dto/internals/summoner-profile.dto';
import { Exclude, Expose } from 'class-transformer';

@Exclude()
export class FindSummonerResponseDto {
  @ApiProperty({
    description: '소환사 프로필',
    type: SummonerProfileDto,
  })
  @Expose()
  readonly summonerProfile!: SummonerProfileDto;
}
