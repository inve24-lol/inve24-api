import { MediaType } from '@core/web-client/constants/media-type.enum';
import { BodyInserter } from '@core/web-client/utils/body-inserter';
import { WebClientResponseDto } from '@core/web-client/dto/web-client-response.dto';

export interface IWebClient {
  get(): this;
  post(): this;
  uri(uri: string): this;
  header(param: Record<string, string>): this;
  contentType(mediaType: MediaType): this;
  body<T>(inserter: BodyInserter<T>): this;
  auth(credentials: { username: string; password: string }): this;
  retrieve(): Promise<WebClientResponseDto>;
}
