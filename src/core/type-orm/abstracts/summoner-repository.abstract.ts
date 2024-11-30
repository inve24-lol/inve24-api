import { SummonerEntity } from '@core/type-orm/entities/summoner.entity';

export abstract class ISummonerRepository {
  abstract saveSummoner(createSummoner: Partial<SummonerEntity>): Promise<SummonerEntity>;
  abstract findSummonersByUserUuid(
    userUuid: string,
  ): Promise<{ summoners: SummonerEntity[]; count: number } | null>;
}
