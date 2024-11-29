import riotConfig from '@core/config/settings/riot.config';
import { Inject, Injectable, InternalServerErrorException } from '@nestjs/common';
import { ConfigType } from '@nestjs/config';
import { RsoAccessUrlParamsDto } from '@summoner/dto/externals/rso-api/rso-access-url-params.dto';
import { RsoApiResponseDto } from '@summoner/dto/externals/rso-api/rso-api-response.dto';
import { RsoAuthCredentialsDto } from '@summoner/dto/externals/rso-api/rso-auth-credentials.dto';
import { RsoBodyFormDto } from '@summoner/dto/externals/rso-api/rso-body-form.dto';
import { RegisterRequestDto } from '@summoner/dto/requests/register-request.dto';
import { RsoAccessUrlResponseDto } from '@summoner/dto/responses/rso-access-url-response.dto';
import { IWebClientService } from '@summoner/web-client/abstracts/web-client-service.abstract';
import { BodyInserter } from '@summoner/web-client/utils/body-inserter';
import { plainToInstance } from 'class-transformer';

@Injectable()
export class SummonerService {
  constructor(
    private readonly webClientService: IWebClientService,
    @Inject(riotConfig.KEY) private readonly config: ConfigType<typeof riotConfig>,
  ) {}

  getRiotSignOnAccessUrl(): RsoAccessUrlResponseDto {
    const { host, authorize, clientId, responseType, scope, redirectUri } =
      this.config.riot.rso.auth;

    const rsoAccessUrlParams = plainToInstance(RsoAccessUrlParamsDto, {
      client_id: clientId,
      redirect_uri: redirectUri,
      response_type: responseType,
      scope,
    });

    const rsoAccessUrlSearchParams = new URLSearchParams({ ...rsoAccessUrlParams });

    const rsoAccessUrl = `${host}/${authorize}?${rsoAccessUrlSearchParams.toString()}`;

    return plainToInstance(RsoAccessUrlResponseDto, { rsoAccessUrl });
  }

  async registerSummoner(uuid: string, registerRequestDto: RegisterRequestDto): Promise<any> {
    const { rsoAccessCode } = registerRequestDto;

    const { accessToken, tokenType } = await this.riotSignOnApi(rsoAccessCode);
  }

  private async riotSignOnApi(rsoAccessCode: string): Promise<RsoApiResponseDto> {
    const { host, token, grantType, clientId, clientSecret, redirectUri } =
      this.config.riot.rso.auth;

    const rsoBodyForm = plainToInstance(RsoBodyFormDto, {
      grant_type: grantType,
      code: rsoAccessCode,
      redirect_uri: redirectUri,
    });

    const rsoAuthCredentials = plainToInstance(RsoAuthCredentialsDto, {
      username: clientId,
      password: clientSecret,
    });

    return await this.webClientService
      .create(host)
      .uri(token)
      .post()
      .body(BodyInserter.fromFormData({ ...rsoBodyForm }))
      .auth(rsoAuthCredentials)
      .retrieve()
      .then((res) => res.toEntity(RsoApiResponseDto))
      .catch((err) => {
        throw new InternalServerErrorException('RSO Http Request failed');
      });
  }
}
