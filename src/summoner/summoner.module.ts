import { WebClientModule } from '@core/web-client/web-client.module';
import { Module } from '@nestjs/common';
import { SummonerController } from '@summoner/controllers/summoner.controller';
import { SummonerService } from '@summoner/services/summoner.service';

@Module({
  imports: [WebClientModule],
  controllers: [SummonerController],
  providers: [SummonerService],
})
export class SummonerModule {}
