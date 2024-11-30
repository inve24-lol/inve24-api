import riotConfig from '@config/settings/riot.config';
import { RiotAuthHeaderDto } from '@http/dto/internals/riot-auth-header.dto';
import { RiotSummonerLeagueAccountDto } from '@http/dto/internals/riot-summoner-league-account.dto';
import { RiotSignOnUrlParamsDto } from '@http/dto/requests/riot-sign-on-url-params.dto';
import { AuthCredentialsDto } from '@http/dto/requests/auth-credentials.dto';
import { OauthBodyFormDataDto } from '@http/dto/requests/oauth-body-form-data.dto';
import { FetchRiotAccountResponseDto } from '@http/dto/responses/fetch-riot-account-response.dto';
import { FetchRiotLeagueResponseDto } from '@http/dto/responses/fetch-riot-league-response.dto';
import { FetchRiotSummonerResponseDto } from '@http/dto/responses/fetch-riot-summoner-response.dto';
import { FetchRiotSignOnResponseDto } from '@http/dto/responses/fetch-riot-sign-on-response.dto';
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

    const riotSignOnUrlParams = plainToInstance(RiotSignOnUrlParamsDto, oauth);

    const riotSignOnUrlSearchParams = new URLSearchParams({ ...riotSignOnUrlParams }).toString();

    return `${auth.host}/${auth.authorize}?${riotSignOnUrlSearchParams}`;
  }

  async generateSummonerLeagueAccount(
    rsoAccessCode: string,
  ): Promise<RiotSummonerLeagueAccountDto> {
    const riotAuthHeader = await this.generateRiotAuthHeader(rsoAccessCode);

    const riotAccountInfo = await this.fetchRiotAccount(riotAuthHeader);

    const riotSummonerInfo = await this.fetchRiotSummoner(riotAuthHeader);

    const riotLeagueInfo = await this.fetchRiotLeague(riotSummonerInfo.id);

    return plainToInstance(RiotSummonerLeagueAccountDto, {
      riotAccountInfo,
      riotSummonerInfo,
      riotLeagueInfo,
    });
  }

  private async generateRiotAuthHeader(rsoAccessCode: string): Promise<RiotAuthHeaderDto> {
    const { tokenType, accessToken } = await this.fetchRiotSignOn(rsoAccessCode);

    return plainToInstance(RiotAuthHeaderDto, { authorization: `${tokenType} ${accessToken}` });
  }

  private async fetchRiotSignOn(rsoAccessCode: string): Promise<FetchRiotSignOnResponseDto> {
    const { auth, oauth } = this.config.riot.rso;

    const oauthBodyFormData = plainToInstance(OauthBodyFormDataDto, { ...oauth, rsoAccessCode });

    const authCredentials = plainToInstance(AuthCredentialsDto, oauth);

    return await this.webClientService
      .create(auth.host)
      .uri(auth.token)
      .post()
      .body(BodyInserter.fromFormData({ ...oauthBodyFormData }))
      .auth(authCredentials)
      .retrieve()
      .then((res) => res.toEntity(FetchRiotSignOnResponseDto))
      .catch((err) => {
        throw new InternalServerErrorException('RSO Fetch failed');
      });
  }

  private async fetchRiotAccount(
    riotAuthHeader: RiotAuthHeaderDto,
  ): Promise<FetchRiotAccountResponseDto> {
    const { asia } = this.config.riot.api;

    return await this.webClientService
      .create(asia.host)
      .uri(asia.account.v1.me)
      .get()
      .header({ ...riotAuthHeader })
      .retrieve()
      .then((res) => res.toEntity(FetchRiotAccountResponseDto))
      .catch((err) => {
        throw new InternalServerErrorException('RIOT-ACCOUNT-V1 Fetch failed');
      });
  }

  private async fetchRiotSummoner(
    riotAuthHeader: RiotAuthHeaderDto,
  ): Promise<FetchRiotSummonerResponseDto> {
    const { kr } = this.config.riot.api;

    return await this.webClientService
      .create(kr.host)
      .uri(kr.summoner.v1.me)
      .get()
      .header({ ...riotAuthHeader })
      .retrieve()
      .then((res) => res.toEntity(FetchRiotSummonerResponseDto))
      .catch((err) => {
        throw new InternalServerErrorException('RIOT-SUMMONER-V1 Fetch failed');
      });
  }

  private async fetchRiotLeague(encryptedSummonerId: string): Promise<FetchRiotLeagueResponseDto> {
    const { kr, appKey } = this.config.riot.api;

    const riotLeagueResponse = await this.webClientService
      .create(kr.host)
      .uri(`${kr.league.v4.summonerId}/${encryptedSummonerId}?api_key=${appKey}`)
      .get()
      .retrieve()
      .then((res) => res.rawBody)
      .catch((err) => {
        throw new InternalServerErrorException('RIOT-LEAGUE-V4 Fetch failed');
      });

    return plainToInstance(FetchRiotLeagueResponseDto, riotLeagueResponse[0]);
  }
}
