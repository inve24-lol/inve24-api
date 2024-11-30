import riotConfig from '@core/config/settings/riot.config';
import { Inject, Injectable, InternalServerErrorException } from '@nestjs/common';
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

@Injectable()
export class SummonerService {
  constructor(
    private readonly webClientService: IWebClientService,
    @Inject(riotConfig.KEY) private readonly config: ConfigType<typeof riotConfig>,
  ) {}

  riotSignOnUrl(): RiotSignOnUrlResponseDto {
    const { auth, oauth } = this.config.riot.rso;

    const rsoAccessUrlParams = plainToInstance(RsoAccessUrlParamsDto, oauth);

    const rsoAccessUrlSearchParams = new URLSearchParams({ ...rsoAccessUrlParams });

    const riotSignOnUrl = `${auth.host}/${auth.authorize}?${rsoAccessUrlSearchParams.toString()}`;

    return plainToInstance(RiotSignOnUrlResponseDto, { riotSignOnUrl });
  }

  async registerSummoner(uuid: string, registerRequestDto: RegisterRequestDto): Promise<any> {
    const { rsoAccessCode } = registerRequestDto;

    const riotApiAuthHeader = await this.generateRiotApiAuthHeader(rsoAccessCode);

    return await this.createSummoner(riotApiAuthHeader);
  }

  private async generateRiotApiAuthHeader(rsoAccessCode: string): Promise<RiotApiAuthHeaderDto> {
    const { tokenType, accessToken } = await this.riotSignOnApi(rsoAccessCode);

    return plainToInstance(RiotApiAuthHeaderDto, {
      authorization: `${tokenType} ${accessToken}`,
    });
  }

  private async createSummoner(
    riotApiAuthHeader: RiotApiAuthHeaderDto,
  ): Promise<CreateSummonerDto> {
    const riotAccountApiResponse = await this.riotAccountApi(riotApiAuthHeader);

    const riotSummonerApiResponse = await this.riotSummonerApi(riotApiAuthHeader);

    const riotLeagueApiResponse = await this.riotLeagueApi(riotSummonerApiResponse.id);

    return plainToInstance(CreateSummonerDto, {
      ...riotAccountApiResponse,
      ...riotSummonerApiResponse,
      ...riotLeagueApiResponse,
    });
  }

  private async riotSignOnApi(rsoAccessCode: string): Promise<RsoApiResponseDto> {
    const { auth, oauth } = this.config.riot.rso;

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
    const { asia } = this.config.riot.api;

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
    const { kr } = this.config.riot.api;

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
    const { kr, appKey } = this.config.riot.api;

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
