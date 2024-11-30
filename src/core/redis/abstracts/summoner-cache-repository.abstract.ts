export abstract class ISummonerCacheRepository {
  abstract setSummoner(uuid: string, summoners: string, ttl: number): Promise<string>;
  abstract getSummoner(uuid: string): Promise<string | null>;
  abstract delSummoner(uuid: string): Promise<void>;
}
