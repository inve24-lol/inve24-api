import { ClassConstructor, plainToInstance } from 'class-transformer';

export class WebClientResponseDto {
  constructor(
    private readonly _statusCode: number,
    private readonly _body: string,
  ) {}

  toEntity<T>(entity: ClassConstructor<T>): T {
    return plainToInstance(entity, JSON.parse(this._body));
  }

  get statusCode() {
    return this._statusCode;
  }

  get rawBody(): string {
    return this._body;
  }
}
