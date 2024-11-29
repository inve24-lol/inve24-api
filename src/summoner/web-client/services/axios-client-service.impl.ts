import { IWebClientService } from '@summoner/web-client/abstracts/web-client-service.abstract';
import { IWebClient } from '@summoner/web-client/abstracts/web-client.interface';
import { AxiosClient } from '@summoner/web-client/adapters/axios-client';

export class AxiosClientServiceImpl extends IWebClientService {
  override create(url?: string): IWebClient {
    return new AxiosClient(url);
  }
}
