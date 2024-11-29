import riotConfig from '@core/config/settings/riot.config';
import { Inject, Injectable, InternalServerErrorException } from '@nestjs/common';
import { ConfigType } from '@nestjs/config';
import { RsoAccessUrlParamsDto } from '@summoner/dto/internals/rso-access-url-params.dto';
import { RsoPostAuthCredentialsDto } from '@summoner/dto/internals/rso-post-auth-credentials.dto';
import { RsoPostBodyFormDto } from '@summoner/dto/internals/rso-post-body-form.dto';
import { RegisterRequestDto } from '@summoner/dto/request/register-request.dto';
import { RsoUrlResponseDto } from '@summoner/dto/responses/rso-url-response.dto';
import { IWebClientService } from '@summoner/web-client/abstracts/web-client-service.abstract';
import { BodyInserter } from '@summoner/web-client/utils/body-inserter';
import { plainToInstance } from 'class-transformer';

@Injectable()
export class SummonerService {
  constructor(
    private readonly webClientService: IWebClientService,
    @Inject(riotConfig.KEY) private readonly config: ConfigType<typeof riotConfig>,
  ) {}

  rsoUrl(): RsoUrlResponseDto {
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

    return plainToInstance(RsoUrlResponseDto, { rsoAccessUrl });
  }

  async register(uuid: string, registerRequestDto: RegisterRequestDto) {
    const { rsoAccessCode } = registerRequestDto;

    const { host, token, grantType, clientId, clientSecret, redirectUri } =
      this.config.riot.rso.auth;

    const rsoPostBodyForm = plainToInstance(RsoPostBodyFormDto, {
      grant_type: grantType,
      code: rsoAccessCode,
      redirect_uri: redirectUri,
    });

    const rsoPostAuthCredentials = plainToInstance(RsoPostAuthCredentialsDto, {
      username: clientId,
      password: clientSecret,
    });

    const rsoResponse = await this.webClientService
      .create(host)
      .uri(token)
      .post()
      .body(BodyInserter.fromFormData({ ...rsoPostBodyForm }))
      .auth(rsoPostAuthCredentials)
      .retrieve()
      .then((res) => res.rawBody)
      .catch((err) => {
        console.log(err);
        throw new InternalServerErrorException('RSO request failed');
      });

    console.log(rsoResponse);

    return { rsoResponse };
  }
}
