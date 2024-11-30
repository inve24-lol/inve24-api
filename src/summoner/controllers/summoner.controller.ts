import { JwtAccessTokenGuard } from '@auth/guards/jwt-access-token.guard';
import { User } from '@common/decorators/user.decorator';
import { Controller, Get, HttpCode, HttpStatus, Query, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { RegisterRequestDto } from '@summoner/dto/requests/register-request.dto';
import { RegisterSummonerResponseDto } from '@summoner/dto/responses/register-summoner-response.dto';
import { RiotSignOnUrlResponseDto } from '@summoner/dto/responses/riot-sign-on-url-response.dto';
import { SummonerService } from '@summoner/services/summoner.service';

@ApiTags('Summoner')
@Controller('summoner')
@UseGuards(JwtAccessTokenGuard)
export class SummonerController {
  constructor(private readonly summonerService: SummonerService) {}

  @ApiOperation({ summary: 'RSO URL 조회' })
  @ApiOkResponse({ type: RiotSignOnUrlResponseDto })
  @ApiBearerAuth('access-token')
  @HttpCode(HttpStatus.OK)
  @Get('v1/rso-url')
  riotSignOnUrl(): RiotSignOnUrlResponseDto {
    return this.summonerService.riotSignOnUrl();
  }

  @ApiOperation({ summary: '소환사 등록' })
  @ApiOkResponse({ type: RegisterSummonerResponseDto })
  @ApiBearerAuth('access-token')
  @HttpCode(HttpStatus.CREATED)
  @Get('v1/summoners')
  async register(
    @User('uuid') uuid: string,
    @Query() registerRequestDto: RegisterRequestDto,
  ): Promise<RegisterSummonerResponseDto> {
    return await this.summonerService.registerSummoner(uuid, registerRequestDto);
  }

  // TODO: 사용자 본인의 라이엇 계정 목록 조회 API

  // TODO: 사용자 본인의 라이엇 계정 조회 API
}
