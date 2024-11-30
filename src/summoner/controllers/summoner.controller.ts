import { JwtAccessTokenGuard } from '@auth/guards/jwt-access-token.guard';
import { User } from '@common/decorators/user.decorator';
import {
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { FindSummonerRequestDto } from '@summoner/dto/requests/find-summoner-request.dto';
import { RegisterSummonerRequestDto } from '@summoner/dto/requests/register-summoner-request.dto';
import { FindSummonerResponseDto } from '@summoner/dto/responses/find-summoner-response.dto';
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
  @Post('v1/summoners')
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

  @ApiOperation({ summary: '소환사 조회' })
  @ApiOkResponse({ type: FindSummonerResponseDto })
  @HttpCode(HttpStatus.OK)
  @Get('v1/summoners/:summonerId')
  async findSummoner(
    @User('uuid') uuid: string,
    @Param() findSummonerRequest: FindSummonerRequestDto,
  ): Promise<FindSummonerResponseDto> {
    return await this.summonerService.findSummoner(uuid, findSummonerRequest);
  }

  // TODO: 사용자 본인의 라이엇 계정 삭제 API
}
