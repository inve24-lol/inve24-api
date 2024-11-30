import { SummonerEntity } from '@type-orm/entities/summoner.entity';

export abstract class ISummonerRepository {
  abstract saveSummoner(createSummoner: Partial<SummonerEntity>): Promise<SummonerEntity>;
  abstract findSummonerByPuuid(puuid: string): Promise<SummonerEntity | null>;
  abstract getSummonerCountByUserUuid(userUuid: string): Promise<number>;
  abstract findSummonerListByUserUuid(userUuid: string): Promise<SummonerEntity[]>;
  abstract deleteSummoner(userUuid: string): Promise<void>;
}
