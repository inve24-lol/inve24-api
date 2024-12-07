import { Module } from '@nestjs/common';
import { SummonerController } from '@summoner/controllers/summoner.controller';
import { SummonerService } from '@summoner/services/summoner.service';
import { ISummonerRepository } from '@type-orm/abstracts/summoner-repository.abstract';
import { SummonerRepositoryImpl } from '@type-orm/repositories/summoner-repository.impl';
import { TypeOrmExModule } from '@type-orm/type-orm-ex.module';
import { ISummonerCacheRepository } from '@redis/abstracts/summoner-cache-repository.abstract';
import { SummonerCacheRepositoryImpl } from '@redis/repositories/summoner-cache-repository.impl';
import { HttpModule } from '@http/http.module';

@Module({
  imports: [HttpModule, TypeOrmExModule.forCustomRepository([SummonerRepositoryImpl])],
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
  exports: [SummonerService],
})
export class SummonerModule {}
