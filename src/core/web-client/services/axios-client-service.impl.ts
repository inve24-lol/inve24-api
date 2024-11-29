import { IWebClientService } from '@core/web-client/abstracts/web-client-service.abstract';
import { IWebClient } from '@core/web-client/abstracts/web-client.interface';
import { AxiosClient } from '@core/web-client/adapters/axios-client';

export class AxiosClientServiceImpl extends IWebClientService {
  override create(url?: string): IWebClient {
    return new AxiosClient(url);
  }
}
