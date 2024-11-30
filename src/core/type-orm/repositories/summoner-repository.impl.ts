import { ISummonerRepository } from '@type-orm/abstracts/summoner-repository.abstract';
import { CustomRepository } from '@type-orm/decorators/custom-repository.decorator';
import { SummonerEntity } from '@type-orm/entities/summoner.entity';
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

  async findSummonerByPuuid(puuid: string): Promise<SummonerEntity | null> {
    try {
      const summoner = await this.findOne({ where: { puuid } });

      return summoner || null;
    } catch (error) {
      throw new InternalServerErrorException('Query failed.');
    }
  }

  async getSummonerCountByUserUuid(userUuid: string): Promise<number> {
    try {
      const count = await this.count({ where: { userUuid } });

      return count;
    } catch (error) {
      throw new InternalServerErrorException('Query failed.');
    }
  }

  async findSummonerListByUserUuid(userUuid: string): Promise<SummonerEntity[]> {
    try {
      const summoners = await this.find({ where: { userUuid } });

      return summoners;
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
