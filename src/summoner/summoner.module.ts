import { WebClientModule } from '@web-client/web-client.module';
import { Module } from '@nestjs/common';
import { SummonerController } from '@summoner/controllers/summoner.controller';
import { SummonerService } from '@summoner/services/summoner.service';
import { ISummonerRepository } from '@core/type-orm/abstracts/summoner-repository.abstract';
import { SummonerRepositoryImpl } from '@core/type-orm/repositories/summoner-repository.impl';
import { TypeOrmExModule } from '@core/type-orm/type-orm-ex.module';
import { ISummonerCacheRepository } from '@redis/abstracts/summoner-cache-repository.abstract';
import { SummonerCacheRepositoryImpl } from '@redis/repositories/summoner-cache-repository.impl';

@Module({
  imports: [WebClientModule, TypeOrmExModule.forCustomRepository([SummonerRepositoryImpl])],
  controllers: [SummonerController],
  providers: [
    SummonerService,
    {
      provide: ISummonerRepository,
      useClass: SummonerRepositoryImpl,
    },
    {
      provide: ISummonerCacheRepository,
      useClass: SummonerCacheRepositoryImpl,
    },
  ],
})
export class SummonerModule {}
