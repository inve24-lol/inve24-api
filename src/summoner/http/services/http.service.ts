import riotConfig from '@config/settings/riot.config';
import { RiotApiAuthHeaderDto } from '@http/dto/requests/riot-api-auth-header.dto';
import { RsoAccessUrlParamsDto } from '@http/dto/requests/rso-access-url-params.dto';
import { RsoAuthCredentialsDto } from '@http/dto/requests/rso-auth-credentials.dto';
import { RsoBodyFormDto } from '@http/dto/requests/rso-body-form.dto';
import { RiotAccountApiResponseDto } from '@http/dto/responses/riot-account-api-response.dto';
import { RiotLeagueApiResponseDto } from '@http/dto/responses/riot-league-api-response.dto';
import { RiotSummonerApiResponseDto } from '@http/dto/responses/riot-summoner-api-response.dto';
import { RsoApiResponseDto } from '@http/dto/responses/rso-api-response.dto';
import { Inject, Injectable, InternalServerErrorException } from '@nestjs/common';
import { ConfigType } from '@nestjs/config';
import { IWebClientService } from '@web-client/abstracts/web-client-service.abstract';
import { BodyInserter } from '@web-client/utils/body-inserter';
import { plainToInstance } from 'class-transformer';

@Injectable()
export class HttpService {
  constructor(
    private readonly webClientService: IWebClientService,
    @Inject(riotConfig.KEY) private readonly config: ConfigType<typeof riotConfig>,
  ) {}

  generateRiotSignOnUrl(): string {
    const { auth, oauth } = this.config.riot.rso;

    const rsoAccessUrlParams = plainToInstance(RsoAccessUrlParamsDto, oauth);

    const rsoAccessUrlSearchParams = new URLSearchParams({ ...rsoAccessUrlParams });

    return `${auth.host}/${auth.authorize}?${rsoAccessUrlSearchParams.toString()}`;
  }

  async riotSignOnApi(rsoAccessCode: string): Promise<RsoApiResponseDto> {
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

  async riotAccountApi(
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

  async riotSummonerApi(
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

  async riotLeagueApi(encryptedSummonerId: string): Promise<RiotLeagueApiResponseDto> {
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
