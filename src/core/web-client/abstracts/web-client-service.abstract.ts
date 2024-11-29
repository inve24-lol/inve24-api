import { IWebClient } from '@core/web-client/abstracts/web-client.interface';

export abstract class IWebClientService {
  abstract create(url?: string): IWebClient;
}
