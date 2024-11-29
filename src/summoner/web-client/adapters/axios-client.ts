import { IWebClient } from '@summoner/web-client/abstracts/web-client.interface';
import { MediaType } from '@summoner/web-client/constants/media-type.enum';
import { WebClientResponseDto } from '@summoner/web-client/dto/web-client-response.dto';
import { BodyInserter } from '@summoner/web-client/utils/body-inserter';
import axios, { AxiosInstance, AxiosRequestConfig } from 'axios';

export class AxiosClient implements IWebClient {
  private static readonly TIMEOUT = 10_000;
  private static readonly MAX_REDIRECTS = 5;

  private readonly _axiosInstance: AxiosInstance;

  private _config: AxiosRequestConfig = {};

  constructor(
    baseURL?: string,
    timeout = AxiosClient.TIMEOUT,
    maxRedirects = AxiosClient.MAX_REDIRECTS,
  ) {
    this._axiosInstance = axios.create({
      baseURL,
      timeout,
      maxRedirects,
    });
  }

  uri(uri?: string): this {
    this._config.url = uri;
    return this;
  }

  get(): this {
    this._config.method = 'GET';
    return this;
  }

  post(): this {
    this._config.method = 'POST';
    return this;
  }

  header(param: Record<string, string>): this {
    this._config.headers = {
      ...this._config.headers,
      ...param,
    };
    return this;
  }

  contentType(mediaType: MediaType): this {
    this._config.headers = {
      ...this._config.headers,
      'Content-Type': mediaType,
    };
    return this;
  }

  body<T>(inserter: BodyInserter<T>): this {
    this._config.data = inserter.data;
    this.contentType(inserter.mediaType);
    return this;
  }

  auth(credentials: { username: string; password: string }): this {
    this._config.auth = credentials;
    return this;
  }

  async retrieve(): Promise<WebClientResponseDto> {
    const response = await this._axiosInstance.request(this._config);
    return new WebClientResponseDto(response.status, response.data);
  }
}
