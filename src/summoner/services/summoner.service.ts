import redisConfig from '@config/settings/redis.config';
import { ISummonerCacheRepository } from '@redis/abstracts/summoner-cache-repository.abstract';
import { ISummonerRepository } from '@type-orm/abstracts/summoner-repository.abstract';
import { ConflictException, Inject, Injectable } from '@nestjs/common';
import { ConfigType } from '@nestjs/config';
import { RiotApiAuthHeaderDto } from '@http/dto/requests/riot-api-auth-header.dto';
import { HttpService } from '@http/services/http.service';
import { RegisterRequestDto } from '@summoner/dto/requests/register-request.dto';
import { RiotSignOnUrlResponseDto } from '@summoner/dto/responses/riot-sign-on-url-response.dto';
import { CreateSummonerDto } from '@summoner/dto/internals/create-summoner.dto';
import { SummonerProfileDto } from '@summoner/dto/internals/summoner-profile.dto';
import { RegisterSummonerResponseDto } from '@summoner/dto/responses/register-summoner-response.dto';
import { plainToInstance } from 'class-transformer';

@Injectable()
export class SummonerService {
  constructor(
    private readonly httpService: HttpService,
    private readonly summonerCacheRepository: ISummonerCacheRepository,
    private readonly summonerRepository: ISummonerRepository,
    @Inject(redisConfig.KEY) private readonly config: ConfigType<typeof redisConfig>,
  ) {}

  riotSignOnUrl(): RiotSignOnUrlResponseDto {
    const riotSignOnUrl = this.httpService.generateRiotSignOnUrl();

    return plainToInstance(RiotSignOnUrlResponseDto, { riotSignOnUrl });
  }

  async registerSummoner(
    uuid: string,
    registerRequestDto: RegisterRequestDto,
  ): Promise<RegisterSummonerResponseDto> {
    const { rsoAccessCode } = registerRequestDto;

    const riotApiAuthHeader = await this.generateRiotApiAuthHeader(rsoAccessCode);

    const summonerProfileList = await this.findSummonerProfileList(uuid, riotApiAuthHeader);

    await this.setSummonerProfileList(uuid, summonerProfileList);

    return plainToInstance(RegisterSummonerResponseDto, { summonerProfileList });
  }

  private async setSummonerProfileList(
    uuid: string,
    summonerProfileList: SummonerProfileDto[],
  ): Promise<void> {
    const summoners = JSON.stringify({ summonerProfileList });

    this.summonerCacheRepository.setSummoner(uuid, summoners, this.config.redis.summoner.ttl);
  }

  private async generateRiotApiAuthHeader(rsoAccessCode: string): Promise<RiotApiAuthHeaderDto> {
    const { tokenType, accessToken } = await this.httpService.riotSignOnApi(rsoAccessCode);

    return plainToInstance(RiotApiAuthHeaderDto, {
      authorization: `${tokenType} ${accessToken}`,
    });
  }

  private async findSummonerProfileList(
    uuid: string,
    riotApiAuthHeader: RiotApiAuthHeaderDto,
  ): Promise<SummonerProfileDto[]> {
    const createSummoner = await this.fetchSummoner(uuid, riotApiAuthHeader);

    await this.checkSummonerExists(createSummoner.puuid);

    await this.getSummonerCountByUuid(uuid);

    await this.createSummoner(createSummoner);

    return this.getSummonerProfileListByUuid(uuid);
  }

  private async fetchSummoner(
    uuid: string,
    riotApiAuthHeader: RiotApiAuthHeaderDto,
  ): Promise<CreateSummonerDto> {
    const riotAccountApiResponse = await this.httpService.riotAccountApi(riotApiAuthHeader);

    const riotSummonerApiResponse = await this.httpService.riotSummonerApi(riotApiAuthHeader);

    const riotLeagueApiResponse = await this.httpService.riotLeagueApi(riotSummonerApiResponse.id);

    return plainToInstance(CreateSummonerDto, {
      uuid,
      ...riotAccountApiResponse,
      ...riotSummonerApiResponse,
      ...riotLeagueApiResponse,
    });
  }

  private async checkSummonerExists(puuid: string): Promise<void> {
    const summoner = await this.summonerRepository.findSummonerByPuuid(puuid);

    if (summoner) throw new ConflictException('해당 라이엇 계정으로 등록된 소환사가 존재합니다.');
  }

  private async getSummonerCountByUuid(uuid: string): Promise<void> {
    const count = await this.summonerRepository.getSummonerCountByUserUuid(uuid);

    if (count >= 5) throw new ConflictException('등록 가능한 소환사 수를 초과하였습니다.');
  }

  private async createSummoner(createSummoner: CreateSummonerDto): Promise<void> {
    await this.summonerRepository.saveSummoner(createSummoner);
  }

  private async getSummonerProfileListByUuid(uuid: string) {
    const summoners = await this.summonerRepository.findSummonerListByUserUuid(uuid);

    return plainToInstance(SummonerProfileDto, summoners);
  }
}
