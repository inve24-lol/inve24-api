import redisConfig from '@core/config/settings/redis.config';
import riotConfig from '@core/config/settings/riot.config';
import { ISummonerCacheRepository } from '@core/redis/abstracts/summoner-cache-repository.abstract';
import { ISummonerRepository } from '@core/type-orm/abstracts/summoner-repository.abstract';
import {
  ConflictException,
  Inject,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { ConfigType } from '@nestjs/config';
import { RiotApiAuthHeaderDto } from '@summoner/dto/externals/api/riot-api-auth-header.dto';
import { RiotAccountApiResponseDto } from '@summoner/dto/externals/api/riot-account-api-response.dto';
import { RiotSummonerApiResponseDto } from '@summoner/dto/externals/api/riot-summoner-api-response.dto';
import { RiotLeagueApiResponseDto } from '@summoner/dto/externals/api/riot-league-api-response.dto';
import { RsoAccessUrlParamsDto } from '@summoner/dto/externals/rso/rso-access-url-params.dto';
import { RsoApiResponseDto } from '@summoner/dto/externals/rso/rso-api-response.dto';
import { RsoAuthCredentialsDto } from '@summoner/dto/externals/rso/rso-auth-credentials.dto';
import { RsoBodyFormDto } from '@summoner/dto/externals/rso/rso-body-form.dto';
import { RegisterRequestDto } from '@summoner/dto/requests/register-request.dto';
import { RiotSignOnUrlResponseDto } from '@summoner/dto/responses/riot-sign-on-url-response.dto';
import { IWebClientService } from '@summoner/web-client/abstracts/web-client-service.abstract';
import { BodyInserter } from '@summoner/web-client/utils/body-inserter';
import { plainToInstance } from 'class-transformer';
import { CreateSummonerDto } from '@summoner/dto/internals/create-summoner.dto';
import { SummonerProfileDto } from '@summoner/dto/internals/summoner-profile.dto';
import { RegisterSummonerResponseDto } from '@summoner/dto/responses/register-summoner-response.dto';

@Injectable()
export class SummonerService {
  constructor(
    private readonly summonerCacheRepository: ISummonerCacheRepository,
    private readonly summonerRepository: ISummonerRepository,
    private readonly webClientService: IWebClientService,
    @Inject(riotConfig.KEY) private readonly lolConfig: ConfigType<typeof riotConfig>,
    @Inject(redisConfig.KEY) private readonly cacheConfig: ConfigType<typeof redisConfig>,
  ) {}

  riotSignOnUrl(): RiotSignOnUrlResponseDto {
    const { auth, oauth } = this.lolConfig.riot.rso;

    const rsoAccessUrlParams = plainToInstance(RsoAccessUrlParamsDto, oauth);

    const rsoAccessUrlSearchParams = new URLSearchParams({ ...rsoAccessUrlParams });

    const riotSignOnUrl = `${auth.host}/${auth.authorize}?${rsoAccessUrlSearchParams.toString()}`;

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

    this.summonerCacheRepository.setSummoner(uuid, summoners, this.cacheConfig.redis.summoner.ttl);
  }

  private async generateRiotApiAuthHeader(rsoAccessCode: string): Promise<RiotApiAuthHeaderDto> {
    const { tokenType, accessToken } = await this.riotSignOnApi(rsoAccessCode);

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
    const riotAccountApiResponse = await this.riotAccountApi(riotApiAuthHeader);

    const riotSummonerApiResponse = await this.riotSummonerApi(riotApiAuthHeader);

    const riotLeagueApiResponse = await this.riotLeagueApi(riotSummonerApiResponse.id);

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

  private async riotSignOnApi(rsoAccessCode: string): Promise<RsoApiResponseDto> {
    const { auth, oauth } = this.lolConfig.riot.rso;

    const rsoBodyForm = plainToInstance(RsoBodyFormDto, { ...oauth, rsoAccessCode });

    const rsoAuthCredentials = plainToInstance(RsoAuthCredentialsDto, oauth);

    return await this.webClientService
      .create(auth.host)
      .uri(auth.token)
      .post()
      .body(BodyInserter.fromFormData({ ...rsoBodyForm }))
      .auth(rsoAuthCredentials)
      .retrieve()
      .then((res) => res.toEntity(RsoApiResponseDto))
      .catch((err) => {
        console.log(err);
        throw new InternalServerErrorException('RSO Http Request failed');
      });
  }

  private async riotAccountApi(
    riotApiAuthHeader: RiotApiAuthHeaderDto,
  ): Promise<RiotAccountApiResponseDto> {
    const { asia } = this.lolConfig.riot.api;

    return await this.webClientService
      .create(asia.host)
      .uri(asia.account.v1.me)
      .get()
      .header({ ...riotApiAuthHeader })
      .retrieve()
      .then((res) => res.toEntity(RiotAccountApiResponseDto))
      .catch((err) => {
        console.log(err);
        throw new InternalServerErrorException('Riot Account V1 Http Request failed');
      });
  }

  private async riotSummonerApi(
    riotApiAuthHeader: RiotApiAuthHeaderDto,
  ): Promise<RiotSummonerApiResponseDto> {
    const { kr } = this.lolConfig.riot.api;

    return await this.webClientService
      .create(kr.host)
      .uri(kr.summoner.v1.me)
      .get()
      .header({ ...riotApiAuthHeader })
      .retrieve()
      .then((res) => res.toEntity(RiotSummonerApiResponseDto))
      .catch((err) => {
        console.log(err);
        throw new InternalServerErrorException('Riot Summoner V1 Http Request failed');
      });
  }

  private async riotLeagueApi(encryptedSummonerId: string): Promise<RiotLeagueApiResponseDto> {
    const { kr, appKey } = this.lolConfig.riot.api;

    const response = await this.webClientService
      .create(kr.host)
      .uri(`${kr.league.v4.summonerId}/${encryptedSummonerId}?api_key=${appKey}`)
      .get()
      .retrieve()
      .then((res) => res.rawBody)
      .catch((err) => {
        console.log(err);
        throw new InternalServerErrorException('Riot League V4 Http Request failed');
      });

    return plainToInstance(RiotLeagueApiResponseDto, response[0]);
  }
}
