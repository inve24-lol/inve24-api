import { MediaType } from '@summoner/web-client/constants/media-type.enum';

export class BodyInserter<T> {
  private constructor(
    private readonly _mediaType: MediaType,
    private readonly _data: T,
  ) {}

  static fromJSON(json: Record<string, unknown>) {
    return new BodyInserter(MediaType.APPLICATION_JSON, json);
  }

  static fromFormData(form: Record<string, unknown>) {
    return new BodyInserter(MediaType.APPLICATION_FORM_URLENCODED, form);
  }

  static fromText(text: string | Buffer) {
    return new BodyInserter(MediaType.TEXT_PLAIN, text);
  }

  get mediaType() {
    return this._mediaType;
  }

  get data() {
    return this._data;
  }
}
