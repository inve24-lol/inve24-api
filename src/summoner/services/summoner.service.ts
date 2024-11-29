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
    const { auth, oauth } = this.config.riot.rso;

    const rsoAccessUrlParams = plainToInstance(RsoAccessUrlParamsDto, oauth);

    const rsoAccessUrlSearchParams = new URLSearchParams({ ...rsoAccessUrlParams });

    const rsoAccessUrl = `${auth.host}/${auth.authorize}?${rsoAccessUrlSearchParams.toString()}`;

    return plainToInstance(RsoAccessUrlResponseDto, { rsoAccessUrl });
  }

  async registerSummoner(uuid: string, registerRequestDto: RegisterRequestDto): Promise<any> {
    const { rsoAccessCode } = registerRequestDto;

    const { accessToken, tokenType } = await this.riotSignOnApi(rsoAccessCode);

    return { accessToken, tokenType };
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
}
