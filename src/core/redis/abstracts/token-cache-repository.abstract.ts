export abstract class ITokenCacheRepository {
  abstract setToken(uuid: string, token: number, ttl: number): Promise<string>;
  abstract getToken(uuid: string): Promise<string | null>;
  abstract delToken(uuid: string): Promise<void>;
}
