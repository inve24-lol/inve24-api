import { JwtAccessTokenGuard } from '@auth/guards/jwt-access-token.guard';
import { User } from '@common/decorators/user.decorator';
import { Controller, Get, HttpCode, HttpStatus, Query, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { RegisterSummonerRequestDto } from '@summoner/dto/requests/register-summoner-request.dto';
import { FindSummonersResponseDto } from '@summoner/dto/responses/find-summoners-response.dto';
import { RiotSignOnUrlResponseDto } from '@summoner/dto/responses/riot-sign-on-url-response.dto';
import { SummonerService } from '@summoner/services/summoner.service';

@ApiTags('Summoner')
@ApiBearerAuth('access-token')
@UseGuards(JwtAccessTokenGuard)
@Controller('summoner')
export class SummonerController {
  constructor(private readonly summonerService: SummonerService) {}

  @ApiOperation({ summary: 'RSO URL 조회' })
  @ApiOkResponse({ type: RiotSignOnUrlResponseDto })
  @HttpCode(HttpStatus.OK)
  @Get('v1/rso-url')
  riotSignOnUrl(): RiotSignOnUrlResponseDto {
    return this.summonerService.riotSignOnUrl();
  }

  @ApiOperation({ summary: '소환사 등록' })
  @ApiOkResponse({ type: FindSummonersResponseDto })
  @HttpCode(HttpStatus.CREATED)
  @Get('v1/summoners')
  async registerSummoner(
    @User('uuid') uuid: string,
    @Query() registerSummonerRequest: RegisterSummonerRequestDto,
  ): Promise<FindSummonersResponseDto> {
    return await this.summonerService.registerSummoner(uuid, registerSummonerRequest);
  }

  @ApiOperation({ summary: '소환사 목록 조회' })
  @ApiOkResponse({ type: FindSummonersResponseDto })
  @HttpCode(HttpStatus.OK)
  @Get('v1/summoners')
  async findSummoners(@User('uuid') uuid: string): Promise<FindSummonersResponseDto> {
    return await this.summonerService.findSummoners(uuid);
  }

  // TODO: 사용자 본인의 라이엇 계정 조회 API

  // TODO: 사용자 본인의 라이엇 계정 삭제 API
}
