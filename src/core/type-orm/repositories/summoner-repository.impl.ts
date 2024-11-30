import { ISummonerRepository } from '@core/type-orm/abstracts/summoner-repository.abstract';
import { CustomRepository } from '@core/type-orm/decorators/custom-repository.decorator';
import { SummonerEntity } from '@core/type-orm/entities/summoner.entity';
import { InternalServerErrorException, Optional } from '@nestjs/common';
import { InjectEntityManager } from '@nestjs/typeorm';
import { EntityManager, QueryRunner, Repository } from 'typeorm';

@CustomRepository(SummonerEntity)
export class SummonerRepositoryImpl
  extends Repository<SummonerEntity>
  implements ISummonerRepository
{
  constructor(
    @InjectEntityManager() manager: EntityManager,
    @Optional() queryRunner?: QueryRunner,
  ) {
    super(SummonerEntity, manager, queryRunner);
  }

  async saveSummoner(createSummoner: Partial<SummonerEntity>): Promise<SummonerEntity> {
    try {
      return await this.save(createSummoner);
    } catch (error) {
      throw new InternalServerErrorException('Query failed.');
    }
  }

  async findSummonersByUserUuid(
    userUuid: string,
  ): Promise<{ summoners: SummonerEntity[]; count: number } | null> {
    try {
      const [summoners, count] = await this.findAndCount({ where: { userUuid } });

      return summoners.length > 0 ? { summoners, count } : null;
    } catch (error) {
      throw new InternalServerErrorException('Query failed.');
    }
  }

  async deleteSummoner(userUuid: string): Promise<void> {
    try {
      await this.delete({ userUuid });
    } catch (error) {
      throw new InternalServerErrorException('Query failed.');
    }
  }
}
