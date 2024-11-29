import riotConfig from '@core/config/settings/riot.config';
import { Inject, Injectable } from '@nestjs/common';
import { ConfigType } from '@nestjs/config';
import { RiotSignOnUrlResponseDto } from '@summoner/dto/responses/riot-sign-on-url-response.dto';
import { IWebClientService } from '@summoner/web-client/abstracts/web-client-service.abstract';
import { plainToInstance } from 'class-transformer';

@Injectable()
export class SummonerService {
  constructor(
    private readonly webClientService: IWebClientService,
    @Inject(riotConfig.KEY) private readonly config: ConfigType<typeof riotConfig>,
  ) {}

  riotSignOnUrl(): RiotSignOnUrlResponseDto {
    const { auth, redirectUri } = this.config.riot.rso;
    const { host, authorize, clientId, responseType, scope } = auth;

    const urlParams = new URLSearchParams({
      client_id: clientId || '',
      redirect_uri: redirectUri || '',
      response_type: responseType || '',
      scope: scope || '',
    });

    const riotSignOnUrl = `${host}/${authorize}?${urlParams.toString()}`;

    return plainToInstance(RiotSignOnUrlResponseDto, { riotSignOnUrl });
  }
}
