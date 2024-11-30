import { SummonerEntity } from '@type-orm/entities/summoner.entity';

export abstract class ISummonerRepository {
  abstract saveSummoner(createSummoner: Partial<SummonerEntity>): Promise<SummonerEntity>;
  abstract findSummonerById(id: number): Promise<SummonerEntity | null>;
  abstract findSummonerByPuuid(puuid: string): Promise<SummonerEntity | null>;
  abstract findSummonerCountByUserUuid(userUuid: string): Promise<number>;
  abstract findSummonersByUserUuid(userUuid: string): Promise<SummonerEntity[]>;
  abstract deleteSummoner(id: number): Promise<void>;
}
