import { JwtAccessTokenGuard } from '@auth/guards/jwt-access-token.guard';
import { Controller, Get, HttpCode, HttpStatus, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOkResponse, ApiOperation } from '@nestjs/swagger';
import { RsoUrlResponseDto } from '@summoner/dto/responses/rso-url-response.dto';
import { SummonerService } from '@summoner/services/summoner.service';

@Controller('summoner')
@UseGuards(JwtAccessTokenGuard)
export class SummonerController {
  constructor(private readonly summonerService: SummonerService) {}

  @ApiOperation({ summary: 'RSO URL 조회' })
  @ApiOkResponse({ type: RsoUrlResponseDto })
  @ApiBearerAuth('access-token')
  @HttpCode(HttpStatus.OK)
  @Get('v1/rso-url')
  rsoUrl(): RsoUrlResponseDto {
    return this.summonerService.rsoUrl();
  }
}
