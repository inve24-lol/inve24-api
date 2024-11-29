import { JwtAccessTokenGuard } from '@auth/guards/jwt-access-token.guard';
import { Controller, Get, HttpCode, HttpStatus, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOkResponse, ApiOperation } from '@nestjs/swagger';
import { RiotSignOnUrlResponseDto } from '@summoner/dto/responses/riot-sign-on-url-response.dto';
import { SummonerService } from '@summoner/services/summoner.service';

@Controller('summoner')
export class SummonerController {
  constructor(private readonly summonerService: SummonerService) {}

  @ApiOperation({ summary: 'RSO URL 조회' })
  @ApiOkResponse({ type: RiotSignOnUrlResponseDto })
  @ApiBearerAuth('access-token')
  @UseGuards(JwtAccessTokenGuard)
  @HttpCode(HttpStatus.OK)
  @Get('v1/rso-url')
  riotSignOnUrl(): RiotSignOnUrlResponseDto {
    return this.summonerService.riotSignOnUrl();
  }
}
