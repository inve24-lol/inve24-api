export abstract class ISocketClientCacheRepository {
  abstract setSocketStatus(puuid: string, status: string, ttl: number): Promise<string>;
  abstract getSocketStatus(puuid: string): Promise<string | null>;
  abstract delSocketStatus(puuid: string): Promise<void>;
}
