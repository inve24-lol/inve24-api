export abstract class ITokenCacheRepository {
  abstract setToken(uuid: string, token: string, ttl: number): Promise<string>;
  abstract getToken(uuid: string): Promise<string | null>;
  abstract delToken(uuid: string): Promise<void>;
}
