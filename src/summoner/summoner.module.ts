import { Module } from '@nestjs/common';
import { SummonerController } from '@summoner/controllers/summoner.controller';
import { SummonerService } from '@summoner/services/summoner.service';

@Module({
  controllers: [SummonerController],
  providers: [SummonerService],
})
export class SummonerModule {}
