import riotConfig from '@core/config/settings/riot.config';
import { Inject, Injectable } from '@nestjs/common';
import { ConfigType } from '@nestjs/config';
import { RsoAccessUrlParamsDto } from '@summoner/dto/internals/rso-access-url-params.dto';
import { RsoUrlResponseDto } from '@summoner/dto/responses/rso-url-response.dto';
import { IWebClientService } from '@summoner/web-client/abstracts/web-client-service.abstract';
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
}
